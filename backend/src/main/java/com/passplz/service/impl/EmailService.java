package com.passplz.service.impl;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.passplz.config.EmailType;
import com.passplz.config.TokenType;
import com.passplz.entity.User;
import com.passplz.exception.ApplicationException;
import com.passplz.service.TokenService;
import com.postmarkapp.postmark.Postmark;
import com.postmarkapp.postmark.client.ApiClient;
import com.postmarkapp.postmark.client.data.model.message.Message;
import com.postmarkapp.postmark.client.data.model.message.MessageResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    @Value("${email.api.host}")
    private String emailHost;

    @Value("${email.api.key}")
    private String emailApiKey;

    @Value("${application.servers.backend}")
    private String backendUrl;

    @Value("${email.api.tokenExpiryMinutes}")
    private String tokenExpiryMinutes;

    private final TokenService tokenService;
    private final TemplateEngine templateEngine;
    private static final String BANNER_PATH = "static/email-banner-base64.txt";

    public void sendEmail(User user, EmailType emailType) {
        log.info("sending {} email to user with id {}",
            emailType.toString().toLowerCase(),
            user.getId());

        String base64Image = getEmailBanner();
        if (base64Image == null || base64Image.isBlank()) {
            log.warn("using alternative email banner");
            base64Image = "🔑 PASS PLZ 🔑";
        }

        Context context = new Context();
        context.setVariable("base64Image", base64Image);
        context.setVariable("username", StringUtils.substringBefore(user.getUsername(), "@"));
        context.setVariable("link", getEmailLink(user, emailType));

        final String htmlBody;
        try {
            htmlBody = templateEngine.process(getEmailTemplate(emailType), context);
        } catch (Exception exception) {
            log.error("error processing {} email template for {}: {}",
                emailType.toString().toLowerCase(),
                user.getUsername(),
                exception.getMessage());
            throw new ApplicationException(
                String.format("error processing %s email template for %s",
                    emailType.toString().toLowerCase(),
                    user.getUsername()));
        }

        Message message = new Message(
            emailHost,
            user.getEmail(),
            getEmailSubject(emailType),
            htmlBody);
        message.setMessageStream("outbound");
        message.setHtmlBody(htmlBody);
        message.setTextBody("The email failed to render. Please get in contact with support.");

        try {
            ApiClient client = Postmark.getApiClient(emailApiKey);
            MessageResponse response = client.deliverMessage(message);
            log.info("successfully sent {} email to {}",
                emailType.toString().toLowerCase(),
                response.getTo());
        } catch (Exception exception) {
            log.error("failed to send {} email for {}: {}",
                emailType.toString().toLowerCase(),
                user.getUsername(),
                exception.getMessage());
            throw new ApplicationException(
                String.format("failed to send %s email for %s",
                    emailType.toString().toLowerCase(),
                    user.getUsername()));
        }
    }

    private String getEmailBanner() {
        try {
            final InputStream inputStream = getClass().getClassLoader()
                .getResourceAsStream(BANNER_PATH);
            return new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
        } catch (Exception exception) {
            log.warn("failed to load email banner");
            return null;
        }
    }

    private String getEmailLink(User user, EmailType emailType) {
        String link = String.format("%s/api/email/%s?email=%s&token=",
            backendUrl,
            getEmailEndpoint(emailType),
            user.getUsername());
        try {
            final String token = tokenService
                .createToken(user, getTokenType(emailType), Long.parseLong(tokenExpiryMinutes));
            link += token;
            return link;
        } catch (Exception exception) {
            log.error("error constructing {} email for {}: {}",
                emailType.toString().toLowerCase(),
                user.getUsername(),
                exception.getMessage());
            throw new ApplicationException(
                String.format("error constructing %s email for %s",
                    emailType.toString().toLowerCase(),
                    user.getUsername()));
        }
    }

    private String getEmailEndpoint(EmailType emailType) {
        return switch (emailType) {
            case VERIFICATION -> "verify-user";
            case RESET -> "verify-reset-password";
            case CANCELLATION -> "cancel-user";
            default -> null;
        };
    }

    private String getEmailSubject(EmailType emailType) {
        return switch (emailType) {
            case VERIFICATION -> "🔑 Welcome to Pass Plz!";
            case RESET -> "🔑 Pass Plz Password Reset Request";
            case CANCELLATION -> "🔑 Pass Plz Account Deletion";
            default -> "🔑 A Message From Pass Plz";
        };
    }

    private String getEmailTemplate(EmailType emailType) {
        return switch (emailType) {
            case VERIFICATION -> "verification-email.html";
            case RESET -> "reset-email.html";
            case CANCELLATION -> "cancellation-email.html";
            default -> null;
        };
    }

    private TokenType getTokenType(EmailType emailType) {
        return switch (emailType) {
            case VERIFICATION -> TokenType.VERIFICATION;
            case RESET -> TokenType.RESET;
            case CANCELLATION -> TokenType.CANCELLATION;
            default -> null;
        };
    }

}

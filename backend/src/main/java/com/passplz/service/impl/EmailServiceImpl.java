package com.passplz.service.impl;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.passplz.config.EmailType;
import com.passplz.config.TokenType;
import com.passplz.entity.User;
import com.passplz.exception.EmailException;
import com.passplz.service.EmailService;
import com.passplz.service.TokenService;
import com.postmarkapp.postmark.client.ApiClient;
import com.postmarkapp.postmark.client.data.model.message.Message;
import com.postmarkapp.postmark.client.data.model.message.MessageResponse;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    @Value("${email.banner}")
    private String emailBanner;

    @Value("${email.api.host}")
    private String emailHost;

    @Value("${email.api.key}")
    private String emailApiKey;

    @Value("${application.servers.backend}")
    private String backendUrl;

    @Value("${email.api.tokenExpiryMinutes}")
    private String tokenExpiryMinutes;

    @Value("${application.admin.email}")
    private String adminEmail;

    @Value("${spring.profile}")
    private String profile;

    private final ApiClient postmarkClient;
    private final TokenService tokenService;
    private final TemplateEngine templateEngine;

    public void sendEmail(User user, EmailType emailType) {
        log.info("sending {} email to user with id {}",
            emailType.toString().toLowerCase(),
            user.getId());

        final String htmlBody;
        final String emailLink = getEmailLink(user, emailType);

        Context context = new Context();
        context.setVariable("banner", emailBanner);
        context.setVariable("username", StringUtils.substringBefore(user.getEmail(), "@"));
        context.setVariable("link", emailLink);

        try {
            htmlBody = templateEngine.process(getEmailTemplate(emailType), context);
        } catch (Exception exception) {
            log.error("error processing {} email template to {}: {}",
                emailType.toString().toLowerCase(),
                user.getEmail(),
                exception.getMessage());
            throw new EmailException(
                String.format("error processing %s email template to %s",
                    emailType.toString().toLowerCase(),
                    user.getEmail()));
        }

        Message message = new Message(
            emailHost,
            user.getEmail(),
            getEmailSubject(emailType),
            htmlBody);
        message.setMessageStream("outbound");
        message.setHtmlBody(htmlBody);
        message.setTextBody("The email failed to render. Please get in contact with support.");

        if (profile.equalsIgnoreCase("local")) {
            log.info("local development: simulating {} email to {} with link: {}",
                emailType.toString().toLowerCase(),
                user.getEmail(),
                emailLink);
            return;
        }

        try {
            final MessageResponse response = postmarkClient.deliverMessage(message);
            log.info("successfully sent {} email to {}",
                emailType.toString().toLowerCase(),
                response.getTo());
        } catch (Exception exception) {
            log.error("failed to send {} email to {}: {}",
                emailType.toString().toLowerCase(),
                user.getEmail(),
                exception.getMessage());
            throw new EmailException(
                String.format("failed to send %s email to %s",
                    emailType.toString().toLowerCase(),
                    user.getEmail()));
        }
    }

    public void sendAdminEmail(String messageText) {
        log.info("sending admin email notification to {}", adminEmail);

        final String htmlBody;
        Context context = new Context();

        context.setVariable("banner", emailBanner);
        context.setVariable("username", StringUtils.substringBefore(adminEmail, "@"));
        context.setVariable("message", messageText);

        try {
            htmlBody = templateEngine.process(getEmailTemplate(EmailType.ADMIN), context);
        } catch (Exception exception) {
            log.error("error processing admin email template: {}", exception.getMessage());
            return;
        }

        Message message = new Message(
            emailHost,
            adminEmail,
            getEmailSubject(EmailType.ADMIN),
            htmlBody);
        message.setMessageStream("outbound");
        message.setHtmlBody(htmlBody);
        message.setTextBody("The admin email failed to render.");

        if (profile.equalsIgnoreCase("local")) {
            log.info("local development: simulating admin notification to {} with message: {}",
                adminEmail,
                messageText);
            return;
        }

        try {
            final MessageResponse response = postmarkClient.deliverMessage(message);
            log.info("successfully sent admin email notification to {}", response.getTo());
        } catch (Exception exception) {
            log.error("failed to send admin email notification to {}: {}",
                adminEmail,
                exception.getMessage());
        }
    }

    @PostConstruct
    private void notifyAdminOnStartup() {
        log.info("application has started successfully");
        sendAdminEmail("The backend server has started.");
    }

    private String getEmailLink(User user, EmailType emailType) {
        String link = String.format("%s/api/email/%s?email=%s&token=",
            backendUrl,
            getEmailEndpoint(emailType),
            user.getEmail());
        try {
            final String token = tokenService
                .createToken(user, getTokenType(emailType), Long.parseLong(tokenExpiryMinutes));
            link += token;
            return link;
        } catch (Exception exception) {
            log.error("error constructing {} email to {}: {}",
                emailType.toString().toLowerCase(),
                user.getEmail(),
                exception.getMessage());
            throw new EmailException(
                String.format("error constructing %s email to %s",
                    emailType.toString().toLowerCase(),
                    user.getEmail()));
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
            case ADMIN -> "🔑 Pass Plz Notification";
            default -> "🔑 A Message From Pass Plz";
        };
    }

    private String getEmailTemplate(EmailType emailType) {
        return switch (emailType) {
            case VERIFICATION -> "verification-email.html";
            case RESET -> "reset-email.html";
            case CANCELLATION -> "cancellation-email.html";
            case ADMIN -> "admin-email.html";
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

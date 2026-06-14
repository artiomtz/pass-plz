package com.passplz.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.passplz.config.TokenType;
import com.passplz.dto.VerificationDto;
import com.passplz.entity.User;
import com.passplz.service.TokenService;
import com.passplz.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/email")
public class EmailController {

    @Value("${application.servers.frontend}")
    private String frontendUrl;

    private final UserService userService;
    private final TokenService tokenService;

    @PostMapping("/verify-user")
    public ResponseEntity<Void> verifyUser(@Valid @RequestBody VerificationDto verificationDto) {
        verificationDto.sanitizeFields();
        final String email = verificationDto.getEmail();
        final String token = verificationDto.getToken();

        log.info("received verification request for {}", email);

        tokenService.deleteExpiredTokens();
        final boolean isValid = tokenService.isTokenValid(token, TokenType.VERIFICATION);
        if (!isValid) {
            log.error("verification token validation failed for {}", email);
            return ResponseEntity.badRequest().build();
        }

        log.info("password verification token validated for {}", email);
        final User user = userService.getUserByEmail(email);
        if (user == null) {
            log.error("verification token validation couldn't find {}", email);
            return ResponseEntity.notFound().build();
        }

        userService.updateUserIsVerified(user.getId(), true);
        tokenService.invalidateToken(token, TokenType.VERIFICATION);
        log.info("successfully verified user with id {}", user.getId());

        return ResponseEntity.ok().build();
    }

    @PostMapping("/verify-reset-password")
    public ResponseEntity<Void> verifyResetPassword(
        @Valid @RequestBody VerificationDto verificationDto) {
        verificationDto.sanitizeFields();
        final String email = verificationDto.getEmail();
        final String token = verificationDto.getToken();

        log.info("received password reset request for {}", email);

        tokenService.deleteExpiredTokens();
        final boolean isValid = tokenService.isTokenValid(token, TokenType.RESET);
        if (!isValid) {
            log.error("password reset token validation failed for {}", email);
            return ResponseEntity.badRequest().build();
        }

        log.info("successfully validated password reset token for {}", email);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/cancel-user")
    public ResponseEntity<Void> cancelUser(@Valid @RequestBody VerificationDto verificationDto) {
        verificationDto.sanitizeFields();
        final String email = verificationDto.getEmail();
        final String token = verificationDto.getToken();

        log.info("received account cancellation request for {}", email);

        tokenService.deleteExpiredTokens();
        final boolean isValid = tokenService.isTokenValid(token, TokenType.CANCELLATION);
        if (!isValid) {
            log.error("cancellation token validation failed for {}", email);
            return ResponseEntity.badRequest().build();
        }

        log.info("account cancellation token validated for {}", email);
        final User user = userService.getUserByEmail(email);
        if (user == null) {
            log.error("account cancellation token validation couldn't find {}", email);
            return ResponseEntity.notFound().build();
        }

        userService.deleteUser(user);
        tokenService.invalidateToken(token, TokenType.CANCELLATION);
        log.info("successfully cancelled account {}", user.getEmail());

        return ResponseEntity.ok().build();
    }

}

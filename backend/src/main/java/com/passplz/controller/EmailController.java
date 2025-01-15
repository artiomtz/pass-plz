package com.passplz.controller;

import java.net.URI;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.passplz.config.TokenType;
import com.passplz.entity.User;
import com.passplz.service.TokenService;
import com.passplz.service.UserService;

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

    private static final String URL_ERROR_PATH = "error";
    private static final String URL_WELCOME_PATH = "welcome";
    private static final String URL_GOODBYE_PATH = "goodbye";
    private static final String URL_RESET_PASSWORD_PATH = "reset-password";

    @GetMapping("/verify-user")
    public ResponseEntity<Void> verifyUser(
        @RequestParam("email") String email,
        @RequestParam("token") String token) {
        log.info("received verification request for {}", email);

        tokenService.deleteExpiredTokens();
        final boolean isValid = tokenService.isTokenValid(token, TokenType.VERIFICATION);
        if (!isValid) {
            log.error("verification token validation failed for {}", email);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .location(URI.create(frontendUrl + "/" + URL_ERROR_PATH))
                .build();
        }

        log.info("password verification token validated for {}", email);
        User user = userService.getUserByEmail(email);
        if (user == null) {
            log.error("verification token validation couldn't find {}", email);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .location(URI.create(frontendUrl + "/" + URL_ERROR_PATH))
                .build();
        }

        userService.updateIsVerified(user.getId(), true);
        log.info("successfully verified user with id {}", user.getId());

        return ResponseEntity.status(HttpStatus.FOUND)
            .location(URI.create(frontendUrl + "/" + URL_WELCOME_PATH))
            .build();
    }

    @GetMapping("/verify-reset-password")
    public ResponseEntity<Void> verifyResetPassword(
        @RequestParam("email") String email,
        @RequestParam("token") String token) {
        log.info("received password reset request for {}", email);

        tokenService.deleteExpiredTokens();
        final boolean isValid = tokenService.isTokenValid(token, TokenType.RESET);
        if (!isValid) {
            log.error("password reset token validation failed for {}", email);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .location(URI.create(frontendUrl + "/" + URL_ERROR_PATH))
                .build();
        }

        log.info("successfully validated password reset token for {}", email);
        return ResponseEntity.status(HttpStatus.FOUND)
            .location(URI.create(frontendUrl + "/" + URL_RESET_PASSWORD_PATH + "?token=" + token))
            .build();
    }

    @GetMapping("/cancel-user")
    public ResponseEntity<Void> cancelUser(
        @RequestParam("email") String email,
        @RequestParam("token") String token) {
        log.info("received account cancellation request for {}", email);

        tokenService.deleteExpiredTokens();
        final boolean isValid = tokenService.isTokenValid(token, TokenType.CANCELLATION);
        if (!isValid) {
            log.error("cancellation token validation failed for {}", email);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .location(URI.create(frontendUrl + "/" + URL_ERROR_PATH))
                .build();
        }

        log.info("account cancellation token validated for {}", email);
        User user = userService.getUserByEmail(email);
        if (user == null) {
            log.error("account cancellation token validation couldn't find {}", email);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .location(URI.create(frontendUrl + "/" + URL_ERROR_PATH))
                .build();
        }

        userService.deleteUser(user.getId());
        log.info("successfully cancelled account {}", user.getUsername());
        return ResponseEntity.status(HttpStatus.FOUND)
            .location(URI.create(frontendUrl + "/" + URL_GOODBYE_PATH))
            .build();
    }

}

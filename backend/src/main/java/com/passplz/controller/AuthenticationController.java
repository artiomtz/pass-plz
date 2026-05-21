package com.passplz.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.passplz.dto.AuthenticationDto;
import com.passplz.service.AuthenticationService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationDto> register(HttpServletRequest request) {
        log.info("received registration request");

        try {
            Thread.sleep(3000);
        } catch (Exception exception) {
            log.warn("delay failed");
        }
        return ResponseEntity.ok(authenticationService.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationDto> authenticate(HttpServletRequest request) {
        log.info("received authentication request");

        try {
            Thread.sleep(3000);
        } catch (Exception exception) {
            log.warn("delay failed");
        }
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }

    @GetMapping("/refresh-token")
    public ResponseEntity<AuthenticationDto> refreshToken(HttpServletRequest request) {
        log.info("received token refresh request");

        try {
            Thread.sleep(3000);
        } catch (Exception exception) {
            log.warn("delay failed");
        }
        return ResponseEntity.ok(authenticationService.refreshToken(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        log.info("received logout request");
        authenticationService.logout(request);

        try {
            Thread.sleep(3000);
        } catch (Exception exception) {
            log.warn("delay failed");
        }
        return ResponseEntity.ok().build();
    }

}

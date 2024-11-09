package com.passplz.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.passplz.dto.AuthenticationDto;
import com.passplz.service.impl.AuthenticationServiceImpl;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationServiceImpl service;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationDto> register(HttpServletRequest request) {
        log.info("received registration request");
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationDto> authenticate(HttpServletRequest request) {
        log.info("received authentication request");
        return ResponseEntity.ok(service.authenticate(request));
    }

    @GetMapping("/refresh-token")
    public ResponseEntity<AuthenticationDto> refreshToken(HttpServletRequest request) {
        log.info("received token refresh request");
        return ResponseEntity.ok(service.refreshToken(request));
    }

}

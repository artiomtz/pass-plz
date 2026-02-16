package com.passplz.controller;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/health")
public class HealthController {

    private final Instant startTime = Instant.now();

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Map<String, String>> health() {
        log.info("received health check request");

        final Duration uptime = Duration.between(startTime, Instant.now());
        final long days = uptime.toDays();
        final long hours = uptime.toHoursPart();
        final long minutes = uptime.toMinutesPart();
        final long seconds = uptime.toSecondsPart();

        String formattedUptime = String
            .format("%d days %02d:%02d:%02d", days, hours, minutes, seconds);
        final Map<String, String> response = Map.of("status", "ok", "uptime", formattedUptime);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        log.info("received ping request");
        return ResponseEntity.ok("pong");
    }

}

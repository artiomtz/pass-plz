package com.passplz.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AuthenticationDto(
    @JsonProperty("access_token") String accessToken,
    @JsonProperty("refresh_token") String refreshToken,
    @JsonProperty("last_visited") LocalDateTime lastVisited,
    @JsonProperty("user_id") Long UserId) {}

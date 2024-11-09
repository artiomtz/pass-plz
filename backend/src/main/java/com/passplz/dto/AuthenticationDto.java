package com.passplz.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AuthenticationDto(
    @JsonProperty("access_token") String accessToken,
    @JsonProperty("refresh_token") String refreshToken) {}

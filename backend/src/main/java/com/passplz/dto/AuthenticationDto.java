package com.passplz.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

public record AuthenticationDto(

    @JsonProperty("access_token") String accessToken,

    @JsonProperty("refresh_token") String refreshToken,

    @JsonProperty("user_id") Long UserId,

    @JsonProperty("last_visited") @JsonFormat(
        pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime lastVisited

) {}

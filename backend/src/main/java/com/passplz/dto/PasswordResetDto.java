package com.passplz.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetDto {

    @NotBlank(message = "token is required")
    private String token;

    @JsonProperty("new_password")
    @NotBlank(message = "new password is required")
    private String newPassword;

}

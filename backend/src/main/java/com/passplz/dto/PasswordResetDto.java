package com.passplz.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetDto {

    @NotBlank(message = "token is required")
    @Size(min = 36, max = 36, message = "token length must be 36 characters")
    private String token;

    @JsonProperty("new_password")
    @NotBlank(message = "new password is required")
    @Size(max = 128, message = "password cannot be longer than 128 characters")
    private String newPassword;

    public void sanitizeFields() {
        this.token = this.token.trim();
        this.newPassword = this.newPassword.trim();
    }

}

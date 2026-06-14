package com.passplz.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VerificationDto {

    @NotBlank(message = "token is required")
    @Size(min = 36, max = 36, message = "token length must be 36 characters")
    private String token;

    @Email
    @NotBlank(message = "email is required")
    @Size(max = 128, message = "email cannot be longer than 128 characters")
    private String email;

    public void sanitizeFields() {
        this.token = this.token.trim();
        this.email = this.email.trim();
    }

}

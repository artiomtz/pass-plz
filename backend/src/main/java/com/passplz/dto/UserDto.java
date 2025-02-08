package com.passplz.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.passplz.config.Role;
import com.passplz.entity.User;
import com.passplz.exception.ApplicationException;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Data
@Slf4j
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    @Email
    @NotBlank(message = "email is required")
    @Size(max = 128, message = "email cannot be longer than 128 characters")
    private String email;

    @NotBlank(message = "password is required")
    @Size(max = 128, message = "password cannot be longer than 128 characters")
    private String password;

    @NotNull(message = "role is required")
    private Role role;

    @NotNull(message = "verification status is required")
    private Boolean isVerified;

    @JsonProperty("created_at")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonProperty("last_visited")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime lastVisited;

    public static User toEntity(UserDto dto) {
        try {
            return User.builder()
                .email(dto.getEmail().trim().toLowerCase())
                .masterPassword(dto.getPassword().trim())
                .role(dto.getRole())
                .isVerified(dto.getIsVerified())
                .createdAt(dto.getCreatedAt())
                .lastVisited(dto.getLastVisited())
                .build();
        } catch (Exception exception) {
            log.error("error converting UserDto to User: {}", exception.getMessage());
            throw new ApplicationException("failed to convert user dto to entity");
        }
    }

    public static UserDto toDto(User entity) {
        try {
            return UserDto.builder()
                .email(entity.getEmail())
                .password(entity.getPassword())
                .role(entity.getRole())
                .isVerified(entity.getIsVerified())
                .createdAt(entity.getCreatedAt())
                .lastVisited(entity.getLastVisited())
                .build();
        } catch (Exception exception) {
            log.error("error converting User to UserDto: {}", exception.getMessage());
            throw new ApplicationException("failed to convert user entry to dto");
        }
    }

}

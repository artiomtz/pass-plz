package com.passplz.dto;

import com.passplz.entity.User;
import com.passplz.exception.ApplicationException;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
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
    @NotEmpty(message = "email is required")
    private String email;

    @NotEmpty(message = "password is required")
    private String password;

    public static User toEntity(UserDto dto) {
        try {
            return User.builder().email(dto.getEmail()).masterPassword(dto.getPassword()).build();
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
                .build();
        } catch (Exception exception) {
            log.error("error converting User to UserDto: {}", exception.getMessage());
            throw new ApplicationException("failed to convert user entry to dto");
        }
    }

}

package com.passplz.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.passplz.entity.PasswordEntry;
import com.passplz.entity.User;
import com.passplz.exception.ApplicationException;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
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
public class PasswordEntryDto {

    @JsonProperty("user_id")
    @NotNull(message = "user ID is required")
    private Long userId;

    @NotEmpty(message = "name is required")
    private String name;

    @NotEmpty(message = "username is required")
    private String username;

    @NotEmpty(message = "password is required")
    private String password;

    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private String category;
    private String link;
    private String note;
    private List<String> tags;
    private LocalDateTime expiration;

    public static PasswordEntry toEntity(PasswordEntryDto dto) {
        try {
            return PasswordEntry.builder()
                .user(User.builder().id(dto.getUserId()).build())
                .name(dto.getName())
                .username(dto.getUsername())
                .password(dto.getPassword())
                .createdDate(dto.getCreatedDate())
                .updatedDate(dto.getUpdatedDate())
                .category(dto.getCategory())
                .link(dto.getLink())
                .note(dto.getNote())
                .tags(dto.getTags())
                .expiration(dto.getExpiration())
                .build();
        } catch (Exception exception) {
            log.error("error converting PasswordEntryDto to PasswordEntry: {}",
                exception.getMessage());
            throw new ApplicationException("failed to convert password dto to entity");
        }
    }

    public static PasswordEntryDto toDto(PasswordEntry entity) {
        try {
            return PasswordEntryDto.builder()
                .userId(entity.getUser().getId())
                .name(entity.getName())
                .username(entity.getUsername())
                .password(entity.getPassword())
                .createdDate(entity.getCreatedDate())
                .updatedDate(entity.getUpdatedDate())
                .category(entity.getCategory())
                .link(entity.getLink())
                .note(entity.getNote())
                .tags(entity.getTags())
                .expiration(entity.getExpiration())
                .build();
        } catch (Exception exception) {
            log.error("error converting PasswordEntry to PasswordEntryDto: {}",
                exception.getMessage());
            throw new ApplicationException("failed to convert password entity to dto");
        }
    }

}

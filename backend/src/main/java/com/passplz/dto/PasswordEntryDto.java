package com.passplz.dto;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.passplz.entity.PasswordEntry;
import com.passplz.entity.User;
import com.passplz.exception.ApplicationException;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
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
public class PasswordEntryDto {

    @JsonProperty("user_id")
    @NotNull(message = "user id is required")
    @Positive(message = "user id must be positive")
    private Long userId;

    @NotBlank(message = "name is required")
    @Size(max = 128, message = "name cannot be longer than 128 characters")
    private String name;

    @NotBlank(message = "username is required")
    @Size(max = 128, message = "username cannot be longer than 128 characters")
    private String username;

    @NotBlank(message = "password is required")
    @Size(max = 128, message = "password cannot be longer than 128 characters")
    private String password;

    @JsonProperty("created_date")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdDate;

    @JsonProperty("updated_date")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedDate;

    @JsonProperty("expiration_date")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime expirationDate;

    @Size(max = 128, message = "category cannot be longer than 128 characters")
    private String category;

    @Pattern(
        regexp = "^[^\\s<>\"{}|^`\\\\]+$",
        message = "link doesn't allow spaces and special characters")
    @Size(max = 512, message = "link cannot be longer than 512 characters")
    private String link;

    @Size(max = 1024, message = "note cannot be longer than 1024 characters")
    private String note;

    @Size(max = 16, message = "cannot have more than 16 tags")
    private List<@Size(max = 16, message = "tags cannot be longer than 16 characters") String> tags;

    public static PasswordEntry toEntity(PasswordEntryDto dto) {
        try {
            return PasswordEntry.builder()
                .user(User.builder().id(dto.getUserId()).build())
                .name(trim(dto.getName()))
                .username(trim(dto.getUsername()))
                .password(trim(dto.getPassword()))
                .createdDate(dto.getCreatedDate())
                .updatedDate(dto.getUpdatedDate())
                .expirationDate(dto.getExpirationDate())
                .category(trim(dto.getCategory()))
                .link(normalizeLink(dto.getLink()))
                .note(trim(dto.getNote()))
                .tags(normalizeTags(dto.getTags()))
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
                .expirationDate(entity.getExpirationDate())
                .category(entity.getCategory())
                .link(entity.getLink())
                .note(entity.getNote())
                .tags(entity.getTags().stream().sorted().toList())
                .build();
        } catch (Exception exception) {
            log.error("error converting PasswordEntry to PasswordEntryDto: {}",
                exception.getMessage());
            throw new ApplicationException("failed to convert password entity to dto");
        }
    }

    private static String trim(String value) {
        return value != null ? value.trim() : null;
    }

    private static String normalizeLink(String link) {
        if (link == null)
            return null;
        try {
            return URLDecoder.decode(link.trim(), StandardCharsets.UTF_8.toString()).toLowerCase();
        } catch (Exception exception) {
            log.warn("couldn't decode password entity link: {}", exception.getMessage());
            return link;
        }
    }

    private static Set<String> normalizeTags(List<String> tags) {
        if (tags == null)
            return Collections.emptySet();
        return tags.stream()
            .filter(Objects::nonNull)
            .map(tag -> tag.trim().toLowerCase().replaceAll("\\s+", "-"))
            .filter(tag -> !tag.isEmpty())
            .collect(Collectors.toSet());
    }

}

package com.passplz.controller;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.passplz.config.EmailType;
import com.passplz.config.TokenType;
import com.passplz.dto.PasswordResetDto;
import com.passplz.dto.UserDto;
import com.passplz.entity.User;
import com.passplz.service.TokenService;
import com.passplz.service.UserService;
import com.passplz.service.impl.EmailService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final EmailService emailService;
    private final TokenService tokenService;

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        log.info("received request to fetch all users");
        final List<UserDto> users = userService.getAllUsers().stream().map(UserDto::toDto).toList();

        log.info("successfully fetched all users");
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        log.info("received request to fetch user with id {}", id);

        final User user = userService.getUserById(id);
        if (user == null) {
            log.warn("couldn't fetch user with id {}", id);
            return ResponseEntity.noContent().build();
        }

        log.info("successfully fetched user with id {}", id);
        return ResponseEntity.ok(UserDto.toDto(user));
    }

    @PostMapping
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody UserDto userDto) {
        log.info("received request to create user {}", userDto.getEmail());

        User userEntity = UserDto.toEntity(userDto);
        final User createdUser = userService.createUser(userEntity);

        log.info("successfully created user {}", userDto.getEmail());
        return ResponseEntity.ok(UserDto.toDto(createdUser));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(
        @PathVariable Long id,
        @Valid @RequestBody UserDto userDto) {
        log.info("received request to update user with id {}", id);

        final User userEntity = UserDto.toEntity(userDto);
        final User updatedUser = userService.updateUser(id, userEntity);
        if (updatedUser == null) {
            log.error("couldn't update user with id {}", id);
            return ResponseEntity.notFound().build();
        }

        log.info("successfully updated user with id {}", id);
        return ResponseEntity.ok(UserDto.toDto(updatedUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        log.info("received request to delete user with id {}", id);
        final boolean isDeleted = userService.deleteUser(id);

        log.info("successfully deleted user with id {}", id);
        return isDeleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @PostMapping("/request-reset-password/{id}")
    public ResponseEntity<Void> requestResetPassword(@PathVariable Long id) {
        log.info("received request to trigger password reset for user with id {}", id);

        final User user = userService.getUserById(id);
        if (user == null) {
            log.error("password reset request couldn't find user with id {}", id);
            return ResponseEntity.notFound().build();
        }

        emailService.sendEmail(user, EmailType.RESET);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(
        @Valid @RequestBody PasswordResetDto passwordResetDto) {
        log.info("received a request to reset password");

        tokenService.deleteExpiredTokens();
        final boolean isValid = tokenService.isTokenValid(passwordResetDto.getToken(),
            TokenType.RESET);
        if (!isValid) {
            log.error("reset token validation failed for token starting with {}",
                StringUtils.substring(passwordResetDto.getToken(), 0, 5));
            return ResponseEntity.notFound().build();
        }

        User user = tokenService.findUser(passwordResetDto.getToken(), TokenType.RESET);
        if (user == null) {
            log.error("reset password couldn't find user");
            return ResponseEntity.notFound().build();
        }

        user.setMasterPassword(passwordResetDto.getNewPassword());
        userService.updateUser(user.getId(), user);
        log.info("successfully changed password for user with id {}", user.getId());

        tokenService.invalidateToken(passwordResetDto.getToken(), TokenType.RESET);
        tokenService.deleteExpiredTokens();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/request-cancellation/{id}")
    public ResponseEntity<Void> requestCancellation(@PathVariable Long id) {
        log.info("received a request to cancel user with id {}", id);

        final User user = userService.getUserById(id);
        if (user == null) {
            log.error("cancellation request couldn't find user with id {}", id);
            return ResponseEntity.notFound().build();
        }

        emailService.sendEmail(user, EmailType.CANCELLATION);
        return ResponseEntity.ok().build();
    }

}

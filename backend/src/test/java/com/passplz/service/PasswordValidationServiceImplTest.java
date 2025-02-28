package com.passplz.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import com.passplz.exception.ValidationException;
import com.passplz.service.impl.PasswordValidationServiceImpl;

@ExtendWith(MockitoExtension.class)
class PasswordValidationServiceImplTest {

    @InjectMocks
    private PasswordValidationServiceImpl passwordValidationService;

    private static final String USER_PASSWORD_MIN_LENGTH = "8";

    @BeforeEach
    void setUp() {
        ReflectionTestUtils
            .setField(passwordValidationService, "userPasswordMinLength", USER_PASSWORD_MIN_LENGTH);
    }

    @Test
    void testValidatePassword_Success() {
        final String validPassword = "Valid1@Password";

        assertDoesNotThrow(() -> passwordValidationService.validatePassword(validPassword));
    }

    @Test
    void testValidatePassword_BlankPassword() {
        final String blankPassword = " ";
        final ValidationException exception = assertThrows(ValidationException.class,
            () -> passwordValidationService.validatePassword(blankPassword));

        assertEquals("new password cannot be blank", exception.getMessage());
    }

    @Test
    void testValidatePassword_TooShort() {
        final String shortPassword = "A1@b";
        final ValidationException exception = assertThrows(ValidationException.class,
            () -> passwordValidationService.validatePassword(shortPassword));

        assertEquals("new password must be at least 8 characters long", exception.getMessage());
    }

    @Test
    void testValidatePassword_MissingUppercase() {
        final String passwordWithoutUppercase = "valid1@password";
        final ValidationException exception = assertThrows(ValidationException.class,
            () -> passwordValidationService.validatePassword(passwordWithoutUppercase));

        assertEquals("new password must contain at least one uppercase letter",
            exception.getMessage());
    }

    @Test
    void testValidatePassword_MissingLowercase() {
        final String passwordWithoutLowercase = "VALID1@PASSWORD";
        final ValidationException exception = assertThrows(ValidationException.class,
            () -> passwordValidationService.validatePassword(passwordWithoutLowercase));

        assertEquals("new password must contain at least one lowercase letter",
            exception.getMessage());
    }

    @Test
    void testValidatePassword_MissingDigit() {
        final String passwordWithoutDigit = "Valid@Password";
        final ValidationException exception = assertThrows(ValidationException.class,
            () -> passwordValidationService.validatePassword(passwordWithoutDigit));

        assertEquals("new password must contain at least one digit", exception.getMessage());
    }

    @Test
    void testValidatePassword_MissingSpecialCharacter() {
        final String passwordWithoutSpecialChar = "Valid1Password";
        final ValidationException exception = assertThrows(ValidationException.class,
            () -> passwordValidationService.validatePassword(passwordWithoutSpecialChar));

        assertEquals("new password must contain at least one special character",
            exception.getMessage());
    }

}

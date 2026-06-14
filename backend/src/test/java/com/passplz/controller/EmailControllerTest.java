package com.passplz.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;

import com.passplz.config.TokenType;
import com.passplz.dto.VerificationDto;
import com.passplz.entity.User;
import com.passplz.service.TokenService;
import com.passplz.service.UserService;

@ExtendWith(MockitoExtension.class)
class EmailControllerTest {

    @InjectMocks
    private EmailController emailController;

    @Mock
    private User mockUser;

    @Mock
    private UserService userService;

    @Mock
    private TokenService tokenService;

    private VerificationDto mockVerificationDto;
    private VerificationDto mockVerificationDtoInvalid;

    private static final String EMAIL = "test@mail.com";
    private static final String VALID_TOKEN = "valid-token";
    private static final String INVALID_TOKEN = "invalid-token";
    private static final String FRONTEND_URL = "http://localhost:3000";

    @BeforeEach
    void setUp() {
        mockVerificationDto = new VerificationDto(VALID_TOKEN, EMAIL);
        mockVerificationDtoInvalid = new VerificationDto(INVALID_TOKEN, EMAIL);

        ReflectionTestUtils.setField(emailController, "frontendUrl", FRONTEND_URL);
    }

    @Test
    void testVerifyUser_Success() {
        when(tokenService.isTokenValid(VALID_TOKEN, TokenType.VERIFICATION)).thenReturn(true);
        when(userService.getUserByEmail(EMAIL)).thenReturn(mockUser);
        doNothing().when(userService).updateUserIsVerified(anyLong(), eq(true));

        ResponseEntity<Void> response = emailController.verifyUser(mockVerificationDto);

        assertEquals(HttpStatus.OK, response.getStatusCode());

        verify(tokenService, times(1)).deleteExpiredTokens();
        verify(userService, times(1)).getUserByEmail(EMAIL);
        verify(userService, times(1)).updateUserIsVerified(anyLong(), eq(true));
    }

    @Test
    void testVerifyUser_InvalidToken() {
        when(tokenService.isTokenValid(INVALID_TOKEN, TokenType.VERIFICATION)).thenReturn(false);

        ResponseEntity<Void> response = emailController.verifyUser(mockVerificationDtoInvalid);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());

        verify(tokenService, times(1)).deleteExpiredTokens();
        verify(userService, never()).getUserByEmail(any());
    }

    @Test
    void testVerifyUser_UserNotFound() {
        when(tokenService.isTokenValid(VALID_TOKEN, TokenType.VERIFICATION)).thenReturn(true);
        when(userService.getUserByEmail(EMAIL)).thenReturn(null);

        ResponseEntity<Void> response = emailController.verifyUser(mockVerificationDto);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

        verify(tokenService, times(1)).deleteExpiredTokens();
        verify(userService, times(1)).getUserByEmail(EMAIL);
    }

    @Test
    void testVerifyResetPassword_Success() {
        when(tokenService.isTokenValid(VALID_TOKEN, TokenType.RESET)).thenReturn(true);

        ResponseEntity<Void> response = emailController.verifyResetPassword(mockVerificationDto);

        assertEquals(HttpStatus.OK, response.getStatusCode());

        verify(tokenService, times(1)).deleteExpiredTokens();
    }

    @Test
    void testVerifyResetPassword_InvalidToken() {
        when(tokenService.isTokenValid(INVALID_TOKEN, TokenType.RESET)).thenReturn(false);

        ResponseEntity<Void> response = emailController
            .verifyResetPassword(mockVerificationDtoInvalid);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());

        verify(tokenService, times(1)).deleteExpiredTokens();
    }

    @Test
    void testCancelUser_Success() {
        when(tokenService.isTokenValid(VALID_TOKEN, TokenType.CANCELLATION)).thenReturn(true);
        when(userService.getUserByEmail(EMAIL)).thenReturn(mockUser);
        doNothing().when(userService).deleteUser(mockUser);

        ResponseEntity<Void> response = emailController.cancelUser(mockVerificationDto);

        assertEquals(HttpStatus.OK, response.getStatusCode());

        verify(tokenService, times(1)).deleteExpiredTokens();
        verify(userService, times(1)).getUserByEmail(EMAIL);
        verify(userService, times(1)).deleteUser(mockUser);
    }

    @Test
    void testCancelUser_InvalidToken() {
        when(tokenService.isTokenValid(INVALID_TOKEN, TokenType.CANCELLATION)).thenReturn(false);

        ResponseEntity<Void> response = emailController.cancelUser(mockVerificationDtoInvalid);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());

        verify(tokenService, times(1)).deleteExpiredTokens();
        verify(userService, never()).getUserByEmail(any());
    }

    @Test
    void testCancelUser_UserNotFound() {
        when(tokenService.isTokenValid(VALID_TOKEN, TokenType.CANCELLATION)).thenReturn(true);
        when(userService.getUserByEmail(EMAIL)).thenReturn(null);

        ResponseEntity<Void> response = emailController.cancelUser(mockVerificationDto);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());

        verify(tokenService, times(1)).deleteExpiredTokens();
        verify(userService, times(1)).getUserByEmail(EMAIL);
    }

}

package com.passplz.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.passplz.config.TokenType;
import com.passplz.entity.Token;
import com.passplz.entity.User;
import com.passplz.exception.ApplicationException;
import com.passplz.repository.TokenRepository;
import com.passplz.service.impl.TokenServiceImpl;

@ExtendWith(MockitoExtension.class)
class TokenServiceImplTest {

    @InjectMocks
    private TokenServiceImpl tokenService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private TokenRepository tokenRepository;

    private User mockUser;
    private Token mockToken;

    private static final Long TOKEN_EXPIRY_MINUTES = 30L;
    private static final String RAW_TOKEN_VALUE = "test-token";

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("user@mail.com");

        mockToken = Token.builder()
            .value("encoded-test-token")
            .type(TokenType.RESET)
            .user(mockUser)
            .isValid(true)
            .createdAt(LocalDateTime.now())
            .expiryDate(LocalDateTime.now().plusMinutes(30L))
            .build();
    }

    @Test
    void testCreateToken_Success() {
        when(passwordEncoder.encode(anyString())).thenReturn(mockToken.getValue());

        final String token = tokenService
            .createToken(mockUser, TokenType.RESET, TOKEN_EXPIRY_MINUTES);

        assertNotNull(token);
        verify(tokenRepository).save(any(Token.class));
    }

    @Test
    void testSaveToken_Success() {
        when(passwordEncoder.encode(anyString())).thenReturn(mockToken.getValue());

        assertDoesNotThrow(() -> tokenService
            .saveToken(mockUser, TokenType.RESET, TOKEN_EXPIRY_MINUTES, RAW_TOKEN_VALUE));
        verify(tokenRepository).save(any(Token.class));
    }

    @Test
    void testSaveToken_Error() {
        when(passwordEncoder.encode(anyString())).thenReturn(mockToken.getValue());
        doThrow(new RuntimeException("Database error")).when(tokenRepository)
            .save(any(Token.class));

        final ApplicationException exception = assertThrows(ApplicationException.class,
            () -> tokenService
                .saveToken(mockUser, TokenType.RESET, TOKEN_EXPIRY_MINUTES, RAW_TOKEN_VALUE));
        assertEquals("error creating reset token", exception.getMessage());
    }

    @Test
    void testFindUser_Success() {
        when(tokenRepository.findAllByType(TokenType.RESET)).thenReturn(List.of(mockToken));
        when(passwordEncoder.matches(RAW_TOKEN_VALUE, mockToken.getValue())).thenReturn(true);

        final User foundUser = tokenService.findUser(RAW_TOKEN_VALUE, TokenType.RESET);

        assertNotNull(foundUser);
        assertEquals(mockUser, foundUser);
    }

    @Test
    void testFindUser_UserNotFound() {
        when(tokenRepository.findAllByType(TokenType.RESET)).thenReturn(List.of());

        final User foundUser = tokenService.findUser(RAW_TOKEN_VALUE, TokenType.RESET);

        assertNull(foundUser);
    }

    @Test
    void testFindUser_Error() {
        when(tokenRepository.findAllByType(TokenType.RESET))
            .thenThrow(new RuntimeException("Database error"));

        final ApplicationException exception = assertThrows(ApplicationException.class,
            () -> tokenService.findUser(RAW_TOKEN_VALUE, TokenType.RESET));
        assertEquals("error finding user by token", exception.getMessage());
    }

    @Test
    void testDoesUserHaveValidToken_Success() {
        when(tokenRepository.findAllByType(TokenType.RESET)).thenReturn(List.of(mockToken));

        boolean result = tokenService.doesUserHaveValidToken(mockUser, TokenType.RESET);

        assertTrue(result);
    }

    @Test
    void testDoesUserHaveValidToken_NoValidToken() {
        when(tokenRepository.findAllByType(TokenType.RESET)).thenReturn(List.of());

        boolean result = tokenService.doesUserHaveValidToken(mockUser, TokenType.RESET);

        assertFalse(result);
    }

    @Test
    void testDoesUserHaveValidToken_Error() {
        when(tokenRepository.findAllByType(TokenType.RESET))
            .thenThrow(new RuntimeException("Database error"));

        final ApplicationException exception = assertThrows(ApplicationException.class,
            () -> tokenService.doesUserHaveValidToken(mockUser, TokenType.RESET));
        assertEquals("error checking valid reset token for user with id 1", exception.getMessage());
    }

    @Test
    void testIsTokenValid_Success() {
        when(tokenRepository.findAllByType(TokenType.RESET)).thenReturn(List.of(mockToken));
        when(passwordEncoder.matches(RAW_TOKEN_VALUE, mockToken.getValue())).thenReturn(true);

        boolean result = tokenService.isTokenValid(RAW_TOKEN_VALUE, TokenType.RESET);

        assertTrue(result);
    }

    @Test
    void testIsTokenValid_InvalidToken() {
        when(tokenRepository.findAllByType(TokenType.RESET)).thenReturn(List.of());

        boolean result = tokenService.isTokenValid(RAW_TOKEN_VALUE, TokenType.RESET);

        assertFalse(result);
    }

    @Test
    void testIsTokenValid_Error() {
        when(tokenRepository.findAllByType(TokenType.RESET))
            .thenThrow(new RuntimeException("Database error"));

        final ApplicationException exception = assertThrows(ApplicationException.class,
            () -> tokenService.isTokenValid(RAW_TOKEN_VALUE, TokenType.RESET));
        assertEquals("error validating reset token", exception.getMessage());
    }

    @Test
    void testInvalidateToken_Success() {
        when(tokenRepository.findAllByType(TokenType.RESET)).thenReturn(List.of(mockToken));
        when(passwordEncoder.matches(RAW_TOKEN_VALUE, mockToken.getValue())).thenReturn(true);

        assertDoesNotThrow(() -> tokenService.invalidateToken(RAW_TOKEN_VALUE, TokenType.RESET));
        verify(tokenRepository).save(any(Token.class));
    }

    @Test
    void testInvalidateToken_TokenNotFound() {
        when(tokenRepository.findAllByType(TokenType.RESET)).thenReturn(List.of());

        assertDoesNotThrow(() -> tokenService.invalidateToken(RAW_TOKEN_VALUE, TokenType.RESET));
        verify(tokenRepository, never()).save(any(Token.class));
    }

    @Test
    void testInvalidateToken_Error() {
        when(tokenRepository.findAllByType(TokenType.RESET))
            .thenThrow(new RuntimeException("Database error"));

        final ApplicationException exception = assertThrows(ApplicationException.class,
            () -> tokenService.invalidateToken(RAW_TOKEN_VALUE, TokenType.RESET));
        assertEquals("error invalidating reset token", exception.getMessage());
    }

    @Test
    void testInvalidateAllTokensForUser_Success() {
        when(tokenRepository.invalidateAllTokensForUser(mockUser)).thenReturn(1);

        assertDoesNotThrow(() -> tokenService.invalidateAllTokensForUser(mockUser));
        verify(tokenRepository).invalidateAllTokensForUser(mockUser);
    }

    @Test
    void testInvalidateAllTokensForUser_Error() {
        when(tokenRepository.invalidateAllTokensForUser(mockUser))
            .thenThrow(new RuntimeException("Database error"));

        assertDoesNotThrow(() -> tokenService.invalidateAllTokensForUser(mockUser));
    }

    @Test
    void testDeleteExpiredTokens_Success() {
        doNothing().when(tokenRepository).deleteExpiredTokens(any(LocalDateTime.class));

        assertDoesNotThrow(() -> tokenService.deleteExpiredTokens());
        verify(tokenRepository).deleteExpiredTokens(any(LocalDateTime.class));
    }

    @Test
    void testDeleteExpiredTokens_Error() {
        doThrow(new RuntimeException("Database error")).when(tokenRepository)
            .deleteExpiredTokens(any(LocalDateTime.class));

        assertDoesNotThrow(() -> tokenService.deleteExpiredTokens());
    }

}

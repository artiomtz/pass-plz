package com.passplz.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.passplz.dto.AuthenticationDto;
import com.passplz.exception.AuthenticationException;
import com.passplz.service.AuthenticationService;

import jakarta.servlet.http.HttpServletRequest;

@ExtendWith(MockitoExtension.class)
class AuthenticationControllerTest {

    @InjectMocks
    private AuthenticationController authenticationController;

    @Mock
    private AuthenticationService authenticationService;

    @Mock
    private HttpServletRequest request;

    private AuthenticationDto mockAuthenticationDto;

    private static final String ACCESS_TOKEN = "access-token";
    private static final String REFRESH_TOKEN = "refresh-token";

    @BeforeEach
    void setUp() {
        mockAuthenticationDto = new AuthenticationDto(
            ACCESS_TOKEN,
            REFRESH_TOKEN,
            LocalDateTime.now(),
            1L);
    }

    @Test
    void testRegister_Success() {
        when(authenticationService.register(request)).thenReturn(mockAuthenticationDto);

        ResponseEntity<AuthenticationDto> response = authenticationController.register(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(ACCESS_TOKEN, response.getBody().accessToken());
        verify(authenticationService, times(1)).register(request);
    }

    @Test
    void testAuthenticate_Success() {
        when(authenticationService.authenticate(request)).thenReturn(mockAuthenticationDto);

        ResponseEntity<AuthenticationDto> response = authenticationController.authenticate(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(ACCESS_TOKEN, response.getBody().accessToken());
        verify(authenticationService, times(1)).authenticate(request);
    }

    @Test
    void testAuthenticate_UserNotFound() {
        when(authenticationService.authenticate(request))
            .thenThrow(new AuthenticationException("user not found"));

        Exception exception = assertThrows(AuthenticationException.class,
            () -> authenticationController.authenticate(request));

        assertEquals("user not found", exception.getMessage());
        verify(authenticationService, times(1)).authenticate(request);
    }

    @Test
    void testRefreshToken_Success() {
        when(authenticationService.refreshToken(request)).thenReturn(mockAuthenticationDto);

        ResponseEntity<AuthenticationDto> response = authenticationController.refreshToken(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(REFRESH_TOKEN, response.getBody().refreshToken());
        verify(authenticationService, times(1)).refreshToken(request);
    }

    @Test
    void testRefreshToken_TokenExpired() {
        when(authenticationService.refreshToken(request))
            .thenThrow(new AuthenticationException("token is not valid"));

        Exception exception = assertThrows(AuthenticationException.class,
            () -> authenticationController.refreshToken(request));

        assertEquals("token is not valid", exception.getMessage());
        verify(authenticationService, times(1)).refreshToken(request);
    }

    @Test
    void testLogout_Success() {
        doNothing().when(authenticationService).logout(request);

        ResponseEntity<Void> response = authenticationController.logout(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(authenticationService, times(1)).logout(request);
    }

}

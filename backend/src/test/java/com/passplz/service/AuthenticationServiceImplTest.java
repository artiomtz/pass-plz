package com.passplz.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.util.ReflectionTestUtils;

import com.passplz.config.Role;
import com.passplz.config.TokenType;
import com.passplz.dto.AuthenticationDto;
import com.passplz.entity.PasswordEntry;
import com.passplz.entity.User;
import com.passplz.exception.AuthenticationException;
import com.passplz.service.impl.AuthenticationServiceImpl;

import jakarta.servlet.http.HttpServletRequest;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceImplTest {

    @InjectMocks
    private AuthenticationServiceImpl authenticationService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private PasswordEntryService passwordEntryService;

    @Mock
    private HttpServletRequest request;

    @Mock
    private TokenService tokenService;

    @Mock
    private UserService userService;

    @Mock
    private JwtService jwtService;

    private User mockAdmin;
    private User mockUser;
    private User mockNewUser;
    private PasswordEntry mockEntry;
    private PasswordEntry mockAdminEntry;

    private static final String ACCESS_TOKEN = "access-token";
    private static final String REFRESH_TOKEN = "refresh-token";
    private static final String BEARER_AUTH_HEADER = "Bearer refresh-token";
    private static final String BASIC_AUTH_HEADER = "Basic dXNlckBtYWlsLmNvbTpTZWN1cmVQYXNzd29yZDEyMyE=";

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setId(2L);
        mockUser.setRole(Role.ROLE_USER);
        mockUser.setEmail("user@mail.com");
        mockUser.setIsVerified(true);

        mockNewUser = new User();
        mockNewUser.setId(null);
        mockNewUser.setEmail("user@mail.com");
        mockNewUser.setMasterPassword("SecurePassword123!");

        mockAdmin = new User();
        mockAdmin.setId(1L);
        mockAdmin.setRole(Role.ROLE_ADMIN);
        mockAdmin.setEmail("admin@mail.com");

        mockEntry = new PasswordEntry();
        mockEntry.setId(2L);
        mockEntry.setUser(mockUser);

        mockAdminEntry = new PasswordEntry();
        mockAdminEntry.setId(1L);
        mockAdminEntry.setUser(mockAdmin);

        ReflectionTestUtils.setField(authenticationService, "jwtRefreshExpirationMinutes", "60");
    }

    @Test
    void testRegister_Success() {
        Mockito.when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(BASIC_AUTH_HEADER);
        Mockito.when(userService.createUser(any(User.class))).thenReturn(mockNewUser);
        Mockito.when(jwtService.generateToken(mockNewUser)).thenReturn(ACCESS_TOKEN);
        Mockito.when(jwtService.generateRefreshToken(mockNewUser)).thenReturn(REFRESH_TOKEN);

        final AuthenticationDto result = authenticationService.register(request);

        assertNotNull(result);
        assertEquals(ACCESS_TOKEN, result.accessToken());
        assertEquals(REFRESH_TOKEN, result.refreshToken());
    }

    @Test
    void testRegister_AuthHeaderMissing() {
        Mockito.when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(null);
        assertThrows(AuthenticationException.class, () -> authenticationService.register(request));
    }

    @Test
    void testAuthenticate_Success() {
        Mockito.when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(BASIC_AUTH_HEADER);
        Mockito.when(userService.getUserByEmail(mockUser.getEmail())).thenReturn(mockUser);
        Mockito.when(jwtService.generateToken(mockUser)).thenReturn(ACCESS_TOKEN);
        Mockito.when(jwtService.generateRefreshToken(mockUser)).thenReturn(REFRESH_TOKEN);

        final AuthenticationDto result = authenticationService.authenticate(request);

        assertNotNull(result);
        assertEquals(ACCESS_TOKEN, result.accessToken());
        assertEquals(REFRESH_TOKEN, result.refreshToken());
    }

    @Test
    void testAuthenticate_UserNotFound() {
        Mockito.when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(BASIC_AUTH_HEADER);
        Mockito.when(userService.getUserByEmail(mockUser.getEmail())).thenReturn(null);

        assertThrows(AuthenticationException.class,
            () -> authenticationService.authenticate(request));
    }

    @Test
    void testAuthenticate_UserNotVerified() {
        Mockito.when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(BASIC_AUTH_HEADER);
        Mockito.when(userService.getUserByEmail(mockUser.getEmail())).thenReturn(mockUser);
        mockUser.setIsVerified(false);

        assertThrows(AuthenticationException.class,
            () -> authenticationService.authenticate(request));
    }

    @Test
    void testRefreshToken_Success() {
        Mockito.when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(BEARER_AUTH_HEADER);
        Mockito.when(userService.getUserByEmail(mockUser.getEmail())).thenReturn(mockUser);
        Mockito.when(jwtService.isTokenValid(REFRESH_TOKEN, mockUser)).thenReturn(true);
        Mockito.when(jwtService.generateToken(mockUser)).thenReturn(ACCESS_TOKEN);
        Mockito.when(jwtService.extractUsername(REFRESH_TOKEN)).thenReturn(mockUser.getEmail());

        final AuthenticationDto result = authenticationService.refreshToken(request);

        assertNotNull(result);
        assertNull(result.refreshToken());
        assertEquals(ACCESS_TOKEN, result.accessToken());
    }

    @Test
    void testRefreshToken_InvalidToken() {
        Mockito.when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(BEARER_AUTH_HEADER);
        Mockito.when(userService.getUserByEmail(mockUser.getEmail())).thenReturn(mockUser);
        Mockito.when(jwtService.isTokenValid(anyString(), any(User.class))).thenReturn(false);
        Mockito.when(jwtService.extractUsername(REFRESH_TOKEN)).thenReturn(mockUser.getEmail());

        assertThrows(AuthenticationException.class,
            () -> authenticationService.refreshToken(request));
    }

    @Test
    void testLogout_Success() {
        Mockito.when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(BEARER_AUTH_HEADER);
        Mockito.when(tokenService.findUser(REFRESH_TOKEN, TokenType.REFRESH)).thenReturn(mockUser);

        authenticationService.logout(request);

        Mockito.verify(tokenService).invalidateAllTokensForUser(mockUser);
    }

    @Test
    void testLogout_AuthHeaderMissing() {
        Mockito.when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(null);
        assertThrows(AuthenticationException.class, () -> authenticationService.logout(request));
    }

    @Test
    void testVerifyUser_Success() {
        Mockito.when(userService.getUserByEmail(mockUser.getEmail())).thenReturn(mockUser);
        SecurityContextHolder.getContext()
            .setAuthentication(
                new UsernamePasswordAuthenticationToken(mockUser, null, mockUser.getAuthorities()));

        assertDoesNotThrow(() -> authenticationService.verifyUser(mockUser.getId()));
    }

    @Test
    void testVerifyUser_AdminSuccess() {
        Mockito.when(userService.getUserByEmail(mockAdmin.getEmail())).thenReturn(mockAdmin);
        SecurityContextHolder.getContext()
            .setAuthentication(new UsernamePasswordAuthenticationToken(
                mockAdmin,
                null,
                mockAdmin.getAuthorities()));

        assertDoesNotThrow(() -> authenticationService.verifyUser(mockUser.getId()));
    }

    @Test
    void testVerifyUser_Unauthorized() {
        assertThrows(AuthenticationException.class,
            () -> authenticationService.verifyUser(mockUser.getId()));
    }

    @Test
    void testVerifyOwnership_Success() {
        Mockito.when(userService.getUserByEmail(mockUser.getEmail())).thenReturn(mockUser);
        Mockito.when(passwordEntryService.getEntryById(mockUser.getId())).thenReturn(mockEntry);
        SecurityContextHolder.getContext()
            .setAuthentication(
                new UsernamePasswordAuthenticationToken(mockUser, null, mockUser.getAuthorities()));

        assertDoesNotThrow(
            () -> authenticationService.verifyOwnership(mockUser.getId(), mockEntry.getId()));
    }

    @Test
    void testVerifyOwnershipById_Success() {
        Mockito.when(userService.getUserByEmail(mockUser.getEmail())).thenReturn(mockUser);
        Mockito.when(passwordEntryService.getEntryById(mockUser.getId())).thenReturn(mockEntry);
        SecurityContextHolder.getContext()
            .setAuthentication(
                new UsernamePasswordAuthenticationToken(mockUser, null, mockUser.getAuthorities()));

        assertDoesNotThrow(() -> authenticationService.verifyOwnership(mockEntry.getId()));
    }

    @Test
    void testVerifyOwnership_AdminSuccess() {
        Mockito.when(userService.getUserByEmail(mockAdmin.getEmail())).thenReturn(mockAdmin);
        SecurityContextHolder.getContext()
            .setAuthentication(new UsernamePasswordAuthenticationToken(
                mockAdmin,
                null,
                mockAdmin.getAuthorities()));

        assertDoesNotThrow(() -> authenticationService.verifyOwnership(mockAdminEntry.getId()));
    }

    @Test
    void testVerifyOwnership_NotOwner() {
        Mockito.when(userService.getUserByEmail(mockUser.getEmail())).thenReturn(mockUser);
        Mockito.when(passwordEntryService.getEntryById(mockAdminEntry.getId()))
            .thenReturn(mockAdminEntry);
        SecurityContextHolder.getContext()
            .setAuthentication(
                new UsernamePasswordAuthenticationToken(mockUser, null, mockUser.getAuthorities()));

        assertThrows(AuthenticationException.class,
            () -> authenticationService.verifyOwnership(mockAdminEntry.getId()));
    }

}

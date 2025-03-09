package com.passplz.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.times;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.passplz.config.Role;
import com.passplz.config.TokenType;
import com.passplz.dto.PasswordResetDto;
import com.passplz.dto.UserDto;
import com.passplz.entity.User;
import com.passplz.service.AuthenticationService;
import com.passplz.service.EmailService;
import com.passplz.service.TokenService;
import com.passplz.service.UserService;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @InjectMocks
    private UserController userController;

    @Mock
    private UserService userService;

    @Mock
    private EmailService emailService;

    @Mock
    private TokenService tokenService;

    @Mock
    private AuthenticationService authenticationService;

    private User mockUser;
    private UserDto mockUserDto;
    private PasswordResetDto mockPasswordResetDto;

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setRole(Role.ROLE_USER);
        mockUser.setEmail("user@mail.com");
        mockUser.setMasterPassword("SecurePassword123!");
        mockUser.setIsVerified(true);
        mockUser.setCreatedAt(LocalDateTime.now().minusDays(10L));
        mockUser.setLastVisited(LocalDateTime.now());

        mockUserDto = new UserDto();
        mockUserDto.setRole(mockUser.getRole());
        mockUserDto.setEmail(mockUser.getEmail());
        mockUserDto.setPassword(mockUser.getPassword());
        mockUserDto.setIsVerified(mockUser.getIsVerified());
        mockUserDto.setCreatedAt(mockUser.getCreatedAt());
        mockUserDto.setLastVisited(mockUser.getLastVisited());

        mockPasswordResetDto = new PasswordResetDto();
        mockPasswordResetDto.setToken("valid-token");
        mockPasswordResetDto.setNewPassword("newSecurePassword123!");
    }

    @Test
    void testGetAllUsers_Success() {
        when(userService.getAllUsers()).thenReturn(List.of(mockUser));

        ResponseEntity<List<UserDto>> response = userController.getAllUsers();

        assertFalse(response.getBody().isEmpty());
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(userService, times(1)).getAllUsers();
    }

    @Test
    void testGetUserById_Success() {
        when(userService.getUserById(mockUser.getId())).thenReturn(mockUser);

        ResponseEntity<UserDto> response = userController.getUserById(mockUser.getId());

        assertEquals(mockUser.getEmail(), response.getBody().getEmail());
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(userService, times(1)).getUserById(mockUser.getId());
    }

    @Test
    void testGetUserById_UserNotFound() {
        when(userService.getUserById(mockUser.getId())).thenReturn(null);

        ResponseEntity<UserDto> response = userController.getUserById(mockUser.getId());

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }

    @Test
    void testCreateUser_Success() {
        when(userService.createUser(any(User.class))).thenReturn(mockUser);

        ResponseEntity<UserDto> response = userController.createUser(mockUserDto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(userService, times(1)).createUser(any(User.class));
    }

    @Test
    void testUpdateUser_Success() {
        when(userService.updateUser(eq(mockUser.getId()), any(User.class))).thenReturn(mockUser);

        ResponseEntity<UserDto> response = userController.updateUser(mockUser.getId(), mockUserDto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(userService, times(1)).updateUser(anyLong(), any(User.class));
    }

    @Test
    void testUpdateUser_UserNotFound() {
        when(userService.updateUser(eq(mockUser.getId()), any(User.class))).thenReturn(null);

        ResponseEntity<UserDto> response = userController.updateUser(mockUser.getId(), mockUserDto);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testUpdateLoginTime_Success() {
        doReturn(mockUser).when(userService).updateLogin(anyLong());

        ResponseEntity<Void> response = userController.updateLoginTime(mockUser.getId());

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(userService, times(1)).updateLogin(mockUser.getId());
    }

    @Test
    void testDeleteUser_Success() {
        when(userService.deleteUser(mockUser.getId())).thenReturn(true);

        ResponseEntity<Void> response = userController.deleteUser(mockUser.getId());

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(userService, times(1)).deleteUser(mockUser.getId());
    }

    @Test
    void testDeleteUser_UserNotFound() {
        when(userService.deleteUser(mockUser.getId())).thenReturn(false);

        ResponseEntity<Void> response = userController.deleteUser(mockUser.getId());

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testRequestResetPassword_Success() {
        when(userService.getUserById(mockUser.getId())).thenReturn(mockUser);
        when(tokenService.doesUserHaveValidToken(mockUser, TokenType.RESET)).thenReturn(false);

        ResponseEntity<Void> response = userController.requestResetPassword(mockUser.getId());

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(userService, times(1)).getUserById(mockUser.getId());
    }

    @Test
    void testRequestResetPassword_UserNotFound() {
        when(userService.getUserById(mockUser.getId())).thenReturn(null);

        ResponseEntity<Void> response = userController.requestResetPassword(mockUser.getId());

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testResetPassword_Success() {
        when(tokenService.isTokenValid("valid-token", TokenType.RESET)).thenReturn(true);
        when(tokenService.findUser("valid-token", TokenType.RESET)).thenReturn(mockUser);

        ResponseEntity<Void> response = userController.resetPassword(mockPasswordResetDto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(userService, times(1)).updateUser(mockUser.getId(), mockUser);
    }

    @Test
    void testResetPassword_InvalidToken() {
        when(tokenService.isTokenValid("valid-token", TokenType.RESET)).thenReturn(false);

        ResponseEntity<Void> response = userController.resetPassword(mockPasswordResetDto);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testRequestCancellation_Success() {
        when(userService.getUserById(mockUser.getId())).thenReturn(mockUser);
        when(tokenService.doesUserHaveValidToken(mockUser, TokenType.CANCELLATION))
            .thenReturn(false);

        ResponseEntity<Void> response = userController.requestCancellation(mockUser.getId());

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(userService, times(1)).getUserById(mockUser.getId());
    }

    @Test
    void testRequestCancellation_UserNotFound() {
        when(userService.getUserById(mockUser.getId())).thenReturn(null);

        ResponseEntity<Void> response = userController.requestCancellation(mockUser.getId());

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

}

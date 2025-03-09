package com.passplz.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.passplz.config.EmailType;
import com.passplz.config.Role;
import com.passplz.entity.User;
import com.passplz.exception.ApplicationException;
import com.passplz.repository.UserRepository;
import com.passplz.service.impl.UserServiceImpl;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @InjectMocks
    private UserServiceImpl userService;

    @Mock
    private EmailService emailService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private PasswordValidationService passwordValidationService;

    private User mockUser;
    private User mockAdmin;

    private static final long WRONG_USER_ID = 99L;
    private static final String ENCODED_PASSWORD = "EncodedPassword";

    @BeforeEach
    void setUp() {
        mockAdmin = new User();
        mockAdmin.setId(1L);
        mockAdmin.setRole(Role.ROLE_ADMIN);
        mockAdmin.setEmail("admin@mail.com");
        mockAdmin.setMasterPassword("AdminPassword123!");
        mockAdmin.setIsVerified(true);
        mockAdmin.setCreatedAt(LocalDateTime.now().minusDays(10L));
        mockAdmin.setLastVisited(LocalDateTime.now());

        mockUser = new User();
        mockUser.setId(2L);
        mockUser.setRole(Role.ROLE_USER);
        mockUser.setEmail("user@mail.com");
        mockUser.setMasterPassword("SecurePassword123!");
        mockUser.setIsVerified(false);
        mockUser.setCreatedAt(LocalDateTime.now().minusDays(10L));
        mockUser.setLastVisited(LocalDateTime.now());
    }

    @Test
    void testGetAllUsers_Success() {
        when(userRepository.findAll()).thenReturn(List.of(mockUser, mockAdmin));

        final List<User> users = userService.getAllUsers();

        assertNotNull(users);
        assertEquals(2, users.size());
        verify(userRepository).findAll();
    }

    @Test
    void testGetUserById_Success() {
        when(userRepository.findById(mockUser.getId())).thenReturn(Optional.of(mockUser));

        final User user = userService.getUserById(mockUser.getId());

        assertNotNull(user);
        assertEquals(mockUser.getEmail(), user.getEmail());
        verify(userRepository).findById(mockUser.getId());
    }

    @Test
    void testGetUserById_UserNotFound() {
        when(userRepository.findById(WRONG_USER_ID)).thenReturn(Optional.empty());

        final User user = userService.getUserById(WRONG_USER_ID);

        assertNull(user);
        verify(userRepository).findById(WRONG_USER_ID);
    }

    @Test
    void testCreateUser_Success() {
        when(userRepository.findByEmail(mockUser.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(mockUser.getMasterPassword()))
            .thenReturn(mockUser.getMasterPassword());
        when(userRepository.save(any(User.class))).thenReturn(mockUser);

        final User createdUser = userService.createUser(mockUser);

        assertNotNull(createdUser);
        assertEquals(Role.ROLE_USER, createdUser.getRole());
        verify(passwordValidationService).validatePassword(mockUser.getMasterPassword());
        verify(emailService).sendEmail(any(User.class), eq(EmailType.VERIFICATION));
    }

    @Test
    void testCreateUser_UserAlreadyExists() {
        when(userRepository.findByEmail(mockUser.getEmail())).thenReturn(Optional.of(mockUser));

        assertThrows(ApplicationException.class, () -> userService.createUser(mockUser));
    }

    @Test
    void testCreateAdmin_Success() {
        when(userRepository.findByEmail(mockAdmin.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(mockAdmin.getMasterPassword())).thenReturn(ENCODED_PASSWORD);
        when(userRepository.save(any(User.class))).thenReturn(mockAdmin);

        final User createdAdmin = userService.createAdmin(mockAdmin);

        assertNotNull(createdAdmin);
        assertEquals(Role.ROLE_ADMIN, createdAdmin.getRole());
    }

    @Test
    void testCreateAdmin_AdminAlreadyExists() {
        when(userRepository.findByEmail(mockAdmin.getEmail())).thenReturn(Optional.of(mockAdmin));

        assertNull(userService.createAdmin(mockAdmin));
    }

    @Test
    void testUpdateUser_Success() {
        User updatedUser = new User();
        updatedUser.setMasterPassword("NewSecurePassword!");

        when(userRepository.findById(mockUser.getId())).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.encode(updatedUser.getMasterPassword())).thenReturn(ENCODED_PASSWORD);
        when(userRepository.save(any(User.class))).thenReturn(mockUser);

        final User result = userService.updateUser(mockUser.getId(), updatedUser);

        assertNotNull(result);
        verify(passwordValidationService).validatePassword(updatedUser.getMasterPassword());
        verify(userRepository).save(mockUser);
    }

    @Test
    void testUpdateUser_UserNotFound() {
        when(userRepository.findById(mockUser.getId())).thenReturn(Optional.empty());

        final User result = userService.updateUser(mockUser.getId(), mockUser);

        assertNull(result);
    }

    @Test
    void testUpdateUserIsVerified_Success() {
        when(userRepository.findById(mockUser.getId())).thenReturn(Optional.of(mockUser));

        userService.updateUserIsVerified(mockUser.getId(), true);

        assertTrue(mockUser.getIsVerified());
        verify(userRepository).save(mockUser);
    }

    @Test
    void testUpdateLogin_Success() {
        when(userRepository.findById(mockUser.getId())).thenReturn(Optional.of(mockUser));
        when(userRepository.save(any(User.class))).thenReturn(mockUser);

        final User result = userService.updateLogin(mockUser.getId());

        assertNotNull(result);
        verify(userRepository).save(mockUser);
    }

    @Test
    void testUpdateLogin_UserNotFound() {
        when(userRepository.findById(mockUser.getId())).thenReturn(Optional.empty());

        final User result = userService.updateLogin(mockUser.getId());

        assertNull(result);
    }

    @Test
    void testDeleteUser_Success() {
        userService.deleteUser(mockUser);

        verify(userRepository).delete(mockUser);
        verify(emailService).sendAdminEmail(anyString());
    }

    @Test
    void testDeleteUserById_Success() {
        when(userRepository.findById(mockUser.getId())).thenReturn(Optional.of(mockUser));

        final boolean result = userService.deleteUser(mockUser.getId());

        assertTrue(result);
        verify(userRepository).delete(mockUser);
    }

    @Test
    void testDeleteUserById_UserNotFound() {
        when(userRepository.findById(mockUser.getId())).thenReturn(Optional.empty());

        final boolean result = userService.deleteUser(mockUser.getId());

        assertFalse(result);
    }

}

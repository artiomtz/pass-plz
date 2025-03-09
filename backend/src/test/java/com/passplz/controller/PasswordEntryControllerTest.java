package com.passplz.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.passplz.config.Role;
import com.passplz.dto.PasswordEntryDto;
import com.passplz.entity.PasswordEntry;
import com.passplz.entity.User;
import com.passplz.repository.PasswordEntryRepository;
import com.passplz.repository.TokenRepository;
import com.passplz.repository.UserRepository;
import com.passplz.service.AuthenticationService;
import com.passplz.service.PasswordEntryService;

@WebMvcTest(PasswordEntryController.class)
class PasswordEntryControllerTest {

    @InjectMocks
    private PasswordEntryController passwordEntryController;

    @Mock
    private PasswordEntryService passwordEntryService;

    @Mock
    private AuthenticationService authenticationService;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private TokenRepository tokenRepository;

    @MockBean
    private PasswordEntryRepository passwordEntryRepository;

    private User mockUser;
    private PasswordEntry mockPasswordEntry;
    private PasswordEntryDto mockPasswordEntryDto;

    @BeforeEach
    void setUp() {

        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setRole(Role.ROLE_ADMIN);
        mockUser.setEmail("user@mail.com");

        mockPasswordEntry = PasswordEntry.builder()
            .id(1L)
            .user(mockUser)
            .name("GitHub")
            .username("testUser")
            .password("encryptedPass")
            .createdDate(LocalDateTime.now().minusDays(10L))
            .updatedDate(LocalDateTime.now())
            .tags(Set.of("work", "work-stuff"))
            .link("https://github.com")
            .note("this is important")
            .category("Work")
            .expirationDate(null)
            .build();

        mockPasswordEntryDto = PasswordEntryDto.builder()
            .userId(mockPasswordEntry.getUser().getId())
            .name(mockPasswordEntry.getName())
            .username(mockPasswordEntry.getUsername())
            .password(mockPasswordEntry.getPassword())
            .createdDate(mockPasswordEntry.getCreatedDate())
            .updatedDate(mockPasswordEntry.getUpdatedDate())
            .tags(mockPasswordEntry.getTags().stream().toList())
            .link(mockPasswordEntry.getLink())
            .note(mockPasswordEntry.getNote())
            .category(mockPasswordEntry.getCategory())
            .expirationDate(mockPasswordEntry.getExpirationDate())
            .build();
    }

    @Test
    void testGetAllEntries_Success() {
        when(passwordEntryService.getAllEntries()).thenReturn(List.of(mockPasswordEntry));

        final ResponseEntity<List<PasswordEntryDto>> response = passwordEntryController
            .getAllEntries();

        assertNotNull(response);
        assertFalse(response.getBody().isEmpty());
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(passwordEntryService, times(1)).getAllEntries();
    }

    @Test
    void testGetEntryById_Success() {
        when(passwordEntryService.getEntryById(mockUser.getId())).thenReturn(mockPasswordEntry);

        final ResponseEntity<PasswordEntryDto> response = passwordEntryController
            .getEntryById(mockUser.getId());

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockPasswordEntryDto.getUserId(), response.getBody().getUserId());
        verify(passwordEntryService, times(1)).getEntryById(mockUser.getId());
    }

    @Test
    void testGetEntryById_NotFound() {
        when(passwordEntryService.getEntryById(mockUser.getId())).thenReturn(null);

        final ResponseEntity<PasswordEntryDto> response = passwordEntryController
            .getEntryById(mockUser.getId());

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }

    @Test
    void testGetAllEntriesByUser_Success() {
        doNothing().when(authenticationService).verifyUser(mockUser.getId());
        when(passwordEntryService.getAllEntriesByUserId(mockUser.getId()))
            .thenReturn(List.of(mockPasswordEntry));

        final ResponseEntity<List<PasswordEntryDto>> response = passwordEntryController
            .getAllEntriesByUser(mockUser.getId());

        assertNotNull(response);
        assertFalse(response.getBody().isEmpty());
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(passwordEntryService, times(1)).getAllEntriesByUserId(mockUser.getId());
    }

    @Test
    void testGetAllEntriesByUser_NotFound() {
        doNothing().when(authenticationService).verifyUser(mockUser.getId());
        when(passwordEntryService.getAllEntriesByUserId(mockUser.getId())).thenReturn(List.of());

        final ResponseEntity<List<PasswordEntryDto>> response = passwordEntryController
            .getAllEntriesByUser(mockUser.getId());

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }

    @Test
    void testCreateEntry_Success() {
        doNothing().when(authenticationService).verifyUser(mockPasswordEntryDto.getUserId());
        doReturn(mockPasswordEntry).when(passwordEntryService)
            .createEntry(any(PasswordEntry.class));

        final ResponseEntity<PasswordEntryDto> response = passwordEntryController
            .createEntry(mockPasswordEntryDto);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(passwordEntryService, times(1)).createEntry(any(PasswordEntry.class));
    }

    @Test
    void testCreateEntry_Unauthorized() {
        doThrow(new SecurityException("Unauthorized")).when(authenticationService)
            .verifyUser(mockPasswordEntryDto.getUserId());

        try {
            passwordEntryController.createEntry(mockPasswordEntryDto);
        } catch (SecurityException exception) {
            assertEquals("Unauthorized", exception.getMessage());
        }
    }

    @Test
    void testUpdateEntry_Success() {
        doNothing().when(authenticationService)
            .verifyOwnership(mockPasswordEntryDto.getUserId(), mockUser.getId());
        when(passwordEntryService.updateEntry(eq(mockUser.getId()), any(PasswordEntry.class)))
            .thenReturn(mockPasswordEntry);

        final ResponseEntity<PasswordEntryDto> response = passwordEntryController
            .updateEntry(mockUser.getId(), mockPasswordEntryDto);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(passwordEntryService, times(1)).updateEntry(anyLong(), any(PasswordEntry.class));
    }

    @Test
    void testUpdateEntry_NotFound() {
        doNothing().when(authenticationService)
            .verifyOwnership(mockPasswordEntryDto.getUserId(), mockUser.getId());
        when(passwordEntryService.updateEntry(eq(mockUser.getId()), any(PasswordEntry.class)))
            .thenReturn(null);

        final ResponseEntity<PasswordEntryDto> response = passwordEntryController
            .updateEntry(mockUser.getId(), mockPasswordEntryDto);

        assertNotNull(response);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testDeleteEntry_Success() {
        doNothing().when(authenticationService).verifyOwnership(mockUser.getId());
        when(passwordEntryService.deleteEntry(mockUser.getId())).thenReturn(true);

        final ResponseEntity<Void> response = passwordEntryController.deleteEntry(mockUser.getId());

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(passwordEntryService, times(1)).deleteEntry(mockUser.getId());
    }

    @Test
    void testDeleteEntry_NotFound() {
        doNothing().when(authenticationService).verifyOwnership(mockUser.getId());
        when(passwordEntryService.deleteEntry(mockUser.getId())).thenReturn(false);

        final ResponseEntity<Void> response = passwordEntryController.deleteEntry(mockUser.getId());

        assertNotNull(response);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

}

package com.passplz.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.passplz.entity.PasswordEntry;
import com.passplz.entity.User;
import com.passplz.exception.ApplicationException;
import com.passplz.repository.PasswordEntryRepository;
import com.passplz.service.impl.PasswordEntryServiceImpl;
import com.passplz.util.EncryptionUtil;

@ExtendWith(MockitoExtension.class)
class PasswordEntryServiceTest {

    @InjectMocks
    private PasswordEntryServiceImpl passwordEntryService;

    @Mock
    private PasswordEntryRepository passwordEntryRepository;

    @Mock
    private EncryptionUtil encryptionUtil;

    @Mock
    private UserService userService;

    private User mockUser;
    private PasswordEntry mockEntry;

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("user@mail.com");

        mockEntry = PasswordEntry.builder()
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
    }

    @Test
    void testGetAllEntries() {
        final List<PasswordEntry> entries = List.of(mockEntry);
        when(passwordEntryRepository.findAll()).thenReturn(entries);
        when(encryptionUtil.decrypt("encryptedPass")).thenReturn("decryptedPass");

        final List<PasswordEntry> results = passwordEntryService.getAllEntries();

        assertEquals(1, results.size());
        assertEquals("decryptedPass", results.get(0).getPassword());
        verify(passwordEntryRepository, times(1)).findAll();
    }

    @Test
    void testGetEntryById_Found() {
        when(passwordEntryRepository.findById(mockEntry.getId()))
            .thenReturn(Optional.of(mockEntry));
        when(encryptionUtil.decrypt("encryptedPass")).thenReturn("decryptedPass");

        final PasswordEntry result = passwordEntryService.getEntryById(mockEntry.getId());

        assertNotNull(result);
        assertEquals("decryptedPass", result.getPassword());
    }

    @Test
    void testGetEntryById_NotFound() {
        when(passwordEntryRepository.findById(mockEntry.getId())).thenReturn(Optional.empty());

        final PasswordEntry result = passwordEntryService.getEntryById(mockEntry.getId());

        assertNull(result);
    }

    @Test
    void testGetAllEntriesByUserId_Success() {
        final List<PasswordEntry> entries = List.of(mockEntry);
        when(userService.getUserById(mockUser.getId())).thenReturn(mockUser);
        when(passwordEntryRepository.findAllByUser(mockUser)).thenReturn(entries);
        when(encryptionUtil.decrypt("encryptedPass")).thenReturn("decryptedPass");

        final List<PasswordEntry> results = passwordEntryService
            .getAllEntriesByUserId(mockUser.getId());

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals("decryptedPass", results.get(0).getPassword());
    }

    @Test
    void testGetAllEntriesByUserId_UserNotFound() {
        when(userService.getUserById(mockUser.getId())).thenReturn(null);

        final Exception exception = assertThrows(ApplicationException.class, () -> {
            passwordEntryService.getAllEntriesByUserId(mockUser.getId());
        });

        assertTrue(exception.getMessage().contains("error fetching the passwords"));
    }

    @Test
    void testCreateEntry_Success() {
        when(userService.getUserById(mockUser.getId())).thenReturn(mockUser);
        when(encryptionUtil.encrypt("plainPass")).thenReturn("encryptedPass");
        when(passwordEntryRepository.save(any(PasswordEntry.class))).thenReturn(mockEntry);

        final PasswordEntry newEntry = PasswordEntry.builder()
            .user(mockUser)
            .name("New Entry")
            .password("plainPass")
            .build();
        final PasswordEntry result = passwordEntryService.createEntry(newEntry);

        assertNotNull(result);
        assertEquals("encryptedPass", result.getPassword());
        verify(passwordEntryRepository, times(1)).save(any(PasswordEntry.class));
    }

    @Test
    void testUpdateEntry_Success() {
        when(encryptionUtil.encrypt("newPass")).thenReturn("encryptedNewPass");
        when(passwordEntryRepository.findById(mockEntry.getId()))
            .thenReturn(Optional.of(mockEntry));
        when(passwordEntryRepository.save(any(PasswordEntry.class))).thenReturn(mockEntry);

        final PasswordEntry updatedEntry = PasswordEntry.builder()
            .name("Updated Name")
            .password("newPass")
            .build();
        final PasswordEntry result = passwordEntryService.updateEntry(mockEntry.getId(),
            updatedEntry);

        assertNotNull(result);
        assertEquals("Updated Name", result.getName());
        assertEquals("encryptedNewPass", result.getPassword());
    }

    @Test
    void testUpdateEntry_NotFound() {
        when(passwordEntryRepository.findById(mockEntry.getId())).thenReturn(Optional.empty());

        final PasswordEntry updatedEntry = PasswordEntry.builder()
            .name("Updated Name")
            .password("newPass")
            .build();
        final PasswordEntry result = passwordEntryService.updateEntry(mockEntry.getId(),
            updatedEntry);

        assertNull(result);
    }

    @Test
    void testDeleteEntry_Success() {
        when(passwordEntryRepository.findById(mockEntry.getId()))
            .thenReturn(Optional.of(mockEntry));
        doNothing().when(passwordEntryRepository).delete(mockEntry);

        final boolean result = passwordEntryService.deleteEntry(mockEntry.getId());

        assertTrue(result);
        verify(passwordEntryRepository, times(1)).delete(mockEntry);
    }

    @Test
    void testDeleteEntry_NotFound() {
        when(passwordEntryRepository.findById(mockEntry.getId())).thenReturn(Optional.empty());

        final boolean result = passwordEntryService.deleteEntry(mockEntry.getId());

        assertFalse(result);
        verify(passwordEntryRepository, never()).delete(any(PasswordEntry.class));
    }

}

package com.passplz.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.web.SecurityFilterChain;

import com.passplz.config.Role;
import com.passplz.entity.PasswordEntry;
import com.passplz.entity.User;
import com.passplz.service.EmailService;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class PasswordEntryRepositoryTest {

    @Autowired
    private PasswordEntryRepository passwordEntryRepository;

    @Autowired
    private UserRepository userRepository;

    @MockBean
    private SecurityFilterChain securityFilterChain;

    @MockBean
    private EmailService emailService;

    private User mockUser;
    private PasswordEntry mockEntry1;
    private PasswordEntry mockEntry2;

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setRole(Role.ROLE_USER);
        mockUser.setEmail("user@mail.com");
        mockUser.setMasterPassword("SecurePassword123!");
        mockUser.setIsVerified(true);
        mockUser.setCreatedAt(LocalDateTime.now().minusDays(10L));
        mockUser.setLastVisited(LocalDateTime.now());

        mockEntry1 = PasswordEntry.builder()
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
            .expirationDate(LocalDateTime.now().plusDays(10L))
            .build();

        mockEntry2 = PasswordEntry.builder()
            .user(mockUser)
            .name("Google")
            .username("testUser123")
            .password("encryptedPass")
            .createdDate(LocalDateTime.now().minusDays(10L))
            .updatedDate(LocalDateTime.now())
            .tags(null)
            .link("https://google.com")
            .note("this is very important")
            .category("Personal")
            .expirationDate(null)
            .build();

        userRepository.save(mockUser);
        passwordEntryRepository.saveAll(List.of(mockEntry1, mockEntry2));
    }

    @Test
    void testFindAllByUser_Success() {
        final List<PasswordEntry> entries = passwordEntryRepository.findAllByUser(mockUser);

        assertFalse(entries.isEmpty());
        assertEquals(2, entries.size());
        assertEquals(mockUser, entries.get(0).getUser());
        assertEquals(mockUser, entries.get(1).getUser());
    }

    @Test
    void testFindAllByUser_UserNotFound() {
        final User nonExistentUser = new User();
        nonExistentUser.setId(99L);
        final List<PasswordEntry> entries = passwordEntryRepository.findAllByUser(nonExistentUser);

        assertTrue(entries.isEmpty());
    }

}

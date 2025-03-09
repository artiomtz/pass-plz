package com.passplz.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.web.SecurityFilterChain;

import com.passplz.config.Role;
import com.passplz.entity.User;
import com.passplz.service.EmailService;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @MockBean
    private EmailService emailService;

    @MockBean
    private SecurityFilterChain securityFilterChain;

    private User mockUser;

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setRole(Role.ROLE_USER);
        mockUser.setEmail("user@mail.com");
        mockUser.setMasterPassword("SecurePassword123!");
        mockUser.setIsVerified(true);
        mockUser.setCreatedAt(LocalDateTime.now().minusDays(10L));
        mockUser.setLastVisited(LocalDateTime.now());

        userRepository.save(mockUser);
    }

    @Test
    void testFindByEmail_Success() {
        final Optional<User> user = userRepository.findByEmail(mockUser.getEmail());

        assertTrue(user.isPresent());
        assertEquals(mockUser.getEmail(), user.get().getEmail());
    }

    @Test
    void testFindByEmail_UserNotFound() {
        final Optional<User> user = userRepository.findByEmail("notfound@mail.com");

        assertFalse(user.isPresent());
    }

}

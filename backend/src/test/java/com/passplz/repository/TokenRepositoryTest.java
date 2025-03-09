package com.passplz.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.web.SecurityFilterChain;

import com.passplz.config.Role;
import com.passplz.config.TokenType;
import com.passplz.entity.Token;
import com.passplz.entity.User;
import com.passplz.service.EmailService;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class TokenRepositoryTest {

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EntityManager entityManager;

    @MockBean
    private EmailService emailService;

    @MockBean
    private SecurityFilterChain securityFilterChain;

    private User mockUser;
    private Token validToken1;
    private Token validToken2;
    private Token expiredToken;

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setRole(Role.ROLE_USER);
        mockUser.setEmail("user@mail.com");
        mockUser.setMasterPassword("SecurePassword123!");
        mockUser.setIsVerified(true);
        mockUser.setCreatedAt(LocalDateTime.now().minusDays(10L));
        mockUser.setLastVisited(LocalDateTime.now());

        validToken1 = Token.builder()
            .type(TokenType.REFRESH)
            .value("token1")
            .isValid(true)
            .createdAt(LocalDateTime.now().minusDays(1L))
            .expiryDate(LocalDateTime.now().plusDays(7L))
            .user(mockUser)
            .build();

        validToken2 = Token.builder()
            .type(TokenType.RESET)
            .value("token2")
            .isValid(true)
            .createdAt(LocalDateTime.now().minusDays(1L))
            .expiryDate(LocalDateTime.now().plusDays(3L))
            .user(mockUser)
            .build();

        expiredToken = Token.builder()
            .type(TokenType.REFRESH)
            .value("token3")
            .isValid(false)
            .createdAt(LocalDateTime.now().minusDays(1L))
            .expiryDate(LocalDateTime.now().minusDays(1L))
            .user(mockUser)
            .build();

        userRepository.save(mockUser);
        tokenRepository.saveAll(List.of(validToken1, validToken2, expiredToken));
    }

    @Test
    void testDeleteExpiredTokens_Success() {
        tokenRepository.deleteExpiredTokens(LocalDateTime.now());
        final List<Token> tokens = tokenRepository.findAll();

        assertFalse(tokens.contains(expiredToken));
        assertEquals(2, tokens.size());
    }

    @Test
    @Transactional
    void testInvalidateAllTokensForUser_Success() {
        final int updatedRows = tokenRepository.invalidateAllTokensForUser(mockUser);
        entityManager.flush();
        entityManager.clear();

        final List<Token> tokens = tokenRepository.findAll();

        assertEquals(2, updatedRows);
        assertTrue(tokens.stream().noneMatch(Token::getIsValid));
    }

    @Test
    void testInvalidateAllTokensForUser_UserNotFound() {
        final User nonExistentUser = new User();
        nonExistentUser.setId(99L);

        final int updatedRows = tokenRepository.invalidateAllTokensForUser(nonExistentUser);

        assertEquals(0, updatedRows);
    }

    @Test
    void testFindAllByType_Success() {
        final List<Token> refreshTokens = tokenRepository.findAllByType(TokenType.REFRESH);

        assertEquals(2, refreshTokens.size());
        assertTrue(refreshTokens.contains(validToken1));
        assertTrue(refreshTokens.contains(expiredToken));
    }

    @Test
    void testFindAllByType_NoTokensFound() {
        final List<Token> resetTokens = tokenRepository.findAllByType(TokenType.VERIFICATION);

        assertTrue(resetTokens.isEmpty());
    }

}

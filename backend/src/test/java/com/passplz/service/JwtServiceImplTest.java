package com.passplz.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Date;
import java.util.Map;

import javax.crypto.SecretKey;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import com.passplz.config.Role;
import com.passplz.entity.User;
import com.passplz.exception.AuthenticationException;
import com.passplz.service.impl.JwtServiceImpl;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@ExtendWith(MockitoExtension.class)
class JwtServiceImplTest {

    @InjectMocks
    private JwtServiceImpl jwtService;

    private User mockUser;

    private static final String JWT_ENCRYPTION_KEY = "TestSecretTestSecretTestSecret"
        + "TestSecretTestSecretTestSecretTestSecretTestSecretTestSecretTestSecret";

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setRole(Role.ROLE_USER);
        mockUser.setEmail("user@mail.com");

        ReflectionTestUtils.setField(jwtService, "jwtExpirationMinutes", "15");
        ReflectionTestUtils.setField(jwtService, "jwtRefreshExpirationMinutes", "15");
        ReflectionTestUtils.setField(jwtService, "jwtEncryptionKey", JWT_ENCRYPTION_KEY);
    }

    @Test
    void testGenerateToken_Success() {
        final String token = jwtService.generateToken(mockUser);

        assertNotNull(token);
        assertEquals(mockUser.getEmail(), jwtService.extractUsername(token));
    }

    @Test
    void testGenerateTokenWithExtraClaims_Success() {
        final Map<String, Object> claims = Map.of("role", "USER");
        final String token = jwtService.generateToken(claims, mockUser);

        assertNotNull(token);
        assertEquals(mockUser.getEmail(), jwtService.extractUsername(token));
        assertEquals("USER", jwtService.extractClaim(token, claimsMap -> claimsMap.get("role")));
    }

    @Test
    void testGenerateRefreshToken_Success() {
        final String token = jwtService.generateRefreshToken(mockUser);

        assertNotNull(token);
        assertEquals(mockUser.getEmail(), jwtService.extractUsername(token));
    }

    @Test
    void testExtractUsername_Success() {
        final String token = jwtService.generateToken(mockUser);
        final String extractedUsername = jwtService.extractUsername(token);

        assertEquals(mockUser.getEmail(), extractedUsername);
    }

    @Test
    void testExtractClaim_Success() {
        final String token = jwtService.generateToken(mockUser);
        final String subject = jwtService.extractClaim(token, Claims::getSubject);

        assertEquals(mockUser.getEmail(), subject);
    }

    @Test
    void testExtractClaim_ExpiredToken() {
        final String expiredToken = generateExpiredToken(mockUser);

        assertThrows(AuthenticationException.class, () -> jwtService.extractUsername(expiredToken));
    }

    @Test
    void testIsTokenValid_Success() {
        final String token = jwtService.generateToken(mockUser);

        assertTrue(jwtService.isTokenValid(token, mockUser));
    }

    @Test
    void testIsTokenValid_InvalidUser() {
        final String token = jwtService.generateToken(mockUser);
        final User mockOtherUser = new User();
        mockOtherUser.setEmail("other@mail.com");

        assertFalse(jwtService.isTokenValid(token, mockOtherUser));
    }

    @Test
    void testIsTokenValid_ExpiredToken() {
        final String expiredToken = generateExpiredToken(mockUser);

        assertThrows(AuthenticationException.class,
            () -> jwtService.isTokenValid(expiredToken, mockUser));
    }

    private String generateExpiredToken(User user) {
        final byte[] keyBytes = Decoders.BASE64.decode(JWT_ENCRYPTION_KEY);
        final SecretKey secretKey = Keys.hmacShaKeyFor(keyBytes);

        return Jwts.builder()
            .subject(user.getEmail())
            .issuedAt(new Date(System.currentTimeMillis() - 10000))
            .expiration(new Date(System.currentTimeMillis() - 5000))
            .signWith(secretKey, Jwts.SIG.HS512)
            .compact();
    }

}

package com.passplz.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.passplz.config.TokenType;
import com.passplz.entity.Token;
import com.passplz.entity.User;
import com.passplz.exception.ApplicationException;
import com.passplz.repository.TokenRepository;
import com.passplz.service.TokenService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {

    private final PasswordEncoder passwordEncoder;
    private final TokenRepository tokenRepository;

    @Override
    public String createToken(User user, TokenType type, Long tokenExpiryMinutes) {
        log.info("creating a new token for user with id {}", user.getId());
        final String newToken = UUID.randomUUID().toString();
        saveToken(user, type, tokenExpiryMinutes, newToken);

        return newToken;
    }

    @Override
    public void saveToken(User user, TokenType type, Long tokenExpiryMinutes, String tokenValue) {
        try {
            final Token newToken = Token.builder()
                .value(passwordEncoder.encode(tokenValue))
                .type(type)
                .user(user)
                .isValid(true)
                .createdAt(LocalDateTime.now())
                .expiryDate(LocalDateTime.now().plusMinutes(tokenExpiryMinutes))
                .build();

            tokenRepository.save(newToken);
            log.info("saved a new token for user with id {}", user.getId());
        } catch (Exception exception) {
            log.error("error creating {} token: {}",
                type.toString().toLowerCase(),
                exception.getMessage());
            throw new ApplicationException(
                String.format("error creating %s token", type.toString().toLowerCase()));
        }
    }

    @Override
    public User findUser(String value, TokenType type) {
        try {
            final List<Token> tokens = tokenRepository.findAllByTypeFetchUser(type);
            return tokens.stream()
                .filter(Token::getIsValid)
                .filter(token -> token.getExpiryDate().isAfter(LocalDateTime.now()))
                .filter(token -> passwordEncoder.matches(value, token.getValue()))
                .map(Token::getUser)
                .findFirst()
                .orElse(null);
        } catch (Exception exception) {
            log.error("error finding user by token: {}", exception.getMessage());
            throw new ApplicationException("error finding user by token");
        }
    }

    @Override
    public boolean doesUserHaveValidToken(User user, TokenType type) {
        final Long userId = user.getId();
        try {
            List<Token> tokens = tokenRepository.findAllByType(type);
            return tokens.stream()
                .filter(Token::getIsValid)
                .filter(token -> token.getExpiryDate().isAfter(LocalDateTime.now()))
                .anyMatch(token -> token.getUser().getId().equals(userId));
        } catch (Exception exception) {
            log.error("error checking valid {} token for user with id {}: {}",
                type.toString().toLowerCase(),
                userId,
                exception.getMessage());
            throw new ApplicationException(
                String.format("error checking valid %s token for user with id %s",
                    type.toString().toLowerCase(),
                    userId));
        }
    }

    @Override
    public boolean isTokenValid(String value, TokenType type) {
        try {
            final List<Token> tokens = tokenRepository.findAllByType(type);
            return tokens.stream()
                .filter(Token::getIsValid)
                .filter(token -> token.getExpiryDate().isAfter(LocalDateTime.now()))
                .anyMatch(token -> passwordEncoder.matches(value, token.getValue()));
        } catch (Exception exception) {
            log.error("error validating {} token", type.toString().toLowerCase());
            throw new ApplicationException(
                String.format("error validating %s token", type.toString().toLowerCase()));
        }
    }

    @Override
    public void invalidateToken(String value, TokenType type) {
        try {
            List<Token> tokens = tokenRepository.findAllByType(type);
            tokens.stream()
                .filter(token -> passwordEncoder.matches(value, token.getValue()))
                .findFirst()
                .ifPresentOrElse(token -> {
                    token.setIsValid(false);
                    tokenRepository.save(token);
                    log.info("successfully invalidated {} token", type.toString().toLowerCase());
                },
                    () -> log.warn("{} token invalidation didn't find the token",
                        type.toString().toLowerCase()));
        } catch (Exception exception) {
            log.error("error invalidating {} token: {}",
                type.toString().toLowerCase(),
                exception.getMessage());
            throw new ApplicationException(
                String.format("error invalidating %s token", type.toString().toLowerCase()));
        }
    }

    @Transactional
    public void invalidateAllTokensForUser(User user) {
        try {
            final int invalidatedCount = tokenRepository.invalidateAllTokensForUser(user);
            log.info("invalidated {} tokens for user with id {}", invalidatedCount, user.getId());
        } catch (Exception exception) {
            log.error("error invalidating tokens for user with id {}: {}",
                user.getId(),
                exception.getMessage());
        }
    }

    @Transactional
    public void deleteExpiredTokens() {
        try {
            tokenRepository.deleteExpiredTokens(LocalDateTime.now());
            log.info("deleted expired tokens");
        } catch (Exception exception) {
            log.error("error deleting expired tokens: {}", exception.getMessage());
        }
    }

}

package com.passplz.service;

import com.passplz.config.TokenType;
import com.passplz.entity.User;

public interface TokenService {

    String createToken(User user, TokenType type, Long tokenExpiryMinutes);

    void saveToken(User user, TokenType type, Long tokenExpiryMinutes, String tokenValue);

    User findUser(String value, TokenType type);

    boolean doesUserHaveValidToken(User user, TokenType type);

    boolean isTokenValid(String token, TokenType type);

    void invalidateToken(String tokenValue, TokenType type);

    public void invalidateAllTokensForUser(User user);

    void deleteExpiredTokens();

}

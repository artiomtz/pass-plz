package com.passplz.service;

import java.util.Map;
import java.util.function.Function;

import com.passplz.entity.User;

import io.jsonwebtoken.Claims;

public interface JwtService {

    String extractUsername(String token);

    <T> T extractClaim(String token, Function<Claims, T> claimsResolver);

    String generateToken(User user);

    String generateToken(Map<String, Object> extraClaims, User user);

    String generateRefreshToken(User user);

    boolean isTokenValid(String token, User user);

}

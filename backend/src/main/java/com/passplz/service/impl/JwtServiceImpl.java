package com.passplz.service.impl;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.passplz.entity.User;
import com.passplz.exception.AuthenticationException;
import com.passplz.service.JwtService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class JwtServiceImpl implements JwtService {

    @Value("${security.jwt.encryptionKey}")
    private String jwtEncryptionKey;

    @Value("${security.jwt.expirationMinutes}")
    private String jwtExpirationMinutes;

    @Value("${security.jwt.refreshExpirationMinutes}")
    private String jwtRefreshExpirationMinutes;

    @Override
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    @Override
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        try {
            final Claims claims = extractAllClaims(token);
            return claimsResolver.apply(claims);
        } catch (ExpiredJwtException exception) {
            log.warn("jwt token has expired");
            throw new AuthenticationException("jwt token has expired");
        } catch (Exception exception) {
            log.error("error extracting claims from jwt: {}", exception.getMessage());
            throw new AuthenticationException("error extracting claims from jwt");
        }
    }

    @Override
    public String generateToken(User user) {
        return generateToken(new HashMap<>(), user);
    }

    @Override
    public String generateToken(Map<String, Object> extraClaims, User user) {
        return buildToken(extraClaims, user, Long.parseLong(jwtExpirationMinutes));
    }

    @Override
    public String generateRefreshToken(User user) {
        return buildToken(new HashMap<>(), user, Long.parseLong(jwtRefreshExpirationMinutes));
    }

    @Override
    public boolean isTokenValid(String token, User user) {
        final String email = extractUsername(token);
        return (email.equals(user.getUsername())) && !isTokenExpired(token);
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private SecretKey getSignInKey() {
        final byte[] keyBytes = Decoders.BASE64.decode(jwtEncryptionKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
            .verifyWith(getSignInKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    private String buildToken(Map<String, Object> extraClaims, User user, long expiration) {
        try {
            return Jwts.builder()
                .claims(extraClaims)
                .claim("authorities", user.getAuthorities())
                .subject(user.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(
                    new Date(System.currentTimeMillis() + TimeUnit.MINUTES.toMillis(expiration)))
                .signWith(getSignInKey(), Jwts.SIG.HS512)
                .compact();
        } catch (Exception exception) {
            log.error("error creating jwt: {}", exception.getMessage());
            throw new AuthenticationException("error creating jwt");
        }
    }

}

package com.passplz.service.impl;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

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

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        try {
            final Claims claims = extractAllClaims(token);
            return claimsResolver.apply(claims);
        } catch (Exception exception) {
            if (exception instanceof ExpiredJwtException) {
                log.warn("jwt token has expired");
                throw new AuthenticationException("jwt token has expired");
            } else {
                log.error("error extracting claims from jwt: {}", exception.getMessage());
                throw new AuthenticationException("error extracting claims from jwt");
            }
        }
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return buildToken(extraClaims, userDetails, Long.parseLong(jwtExpirationMinutes));
    }

    public String generateRefreshToken(UserDetails userDetails) {
        return buildToken(new HashMap<>(),
            userDetails,
            Long.parseLong(jwtRefreshExpirationMinutes));
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
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

    private String buildToken(
        Map<String, Object> extraClaims,
        UserDetails userDetails,
        long expiration) {
        try {
            return Jwts.builder()
                .claims(extraClaims)
                .claim("authorities", userDetails.getAuthorities())
                .subject(userDetails.getUsername())
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

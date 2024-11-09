package com.passplz.service.impl;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import com.passplz.dto.AuthenticationDto;
import com.passplz.entity.User;
import com.passplz.exception.AuthenticationException;
import com.passplz.service.AuthenticationService;
import com.passplz.service.JwtService;
import com.passplz.service.UserService;

import io.jsonwebtoken.io.Decoders;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

	private final JwtService jwtService;
	private final UserService userService;
	private final AuthenticationManager authenticationManager;

	public AuthenticationDto register(HttpServletRequest request) {
		final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
		validateAuthHeader(authHeader, "basic");

		final String[] credentials = getCredentialsFromHeader(authHeader);
		final User user = User.builder()
			.email(credentials[0])
			.masterPassword(credentials[1])
			.build();

		userService.createUser(user);
		final String accessToken = jwtService.generateToken(user);
		final String refreshToken = jwtService.generateRefreshToken(user);

		return new AuthenticationDto(accessToken, refreshToken);
	}

	public AuthenticationDto authenticate(HttpServletRequest request) {
		final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
		validateAuthHeader(authHeader, "basic");

		final String[] credentials = getCredentialsFromHeader(authHeader);
		try {
			authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(credentials[0], credentials[1]));
		} catch (Exception exception) {
			log.error("error in authentication manager: {}", exception.getMessage());
			throw new AuthenticationException("error authenticating credentials");
		}
		final User user = userService.getUserByEmail(credentials[0]);
		final String accessToken = jwtService.generateToken(user);
		final String refreshToken = jwtService.generateRefreshToken(user);

		return new AuthenticationDto(accessToken, refreshToken);
	}

	public AuthenticationDto refreshToken(HttpServletRequest request) {
		final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
		validateAuthHeader(authHeader, "bearer");

		final String refreshToken = authHeader.substring("bearer ".length()).trim();
		final String userEmail = jwtService.extractUsername(refreshToken);
		final User user = userService.getUserByEmail(userEmail);

		if (!jwtService.isTokenValid(refreshToken, user)) {
			log.error("token is not valid");
			throw new AuthenticationException("token is not valid");
		}
		final String accessToken = jwtService.generateToken(user);
		return new AuthenticationDto(accessToken, null);
	}

	public static void validateAuthHeader(String authHeader, String authType) {
		if (authHeader == null || !authHeader.toLowerCase().startsWith(authType)) {
			log.error("error validating authentication {} header", authType);
			throw new AuthenticationException(
				String.format("error validating authentication %s header", authHeader));
		}
		log.info("{} authentication header validated", authType);
	}

	public static String[] getCredentialsFromHeader(String authHeader) {
		try {
			final String base64Credentials = authHeader.substring("basic ".length()).trim();
			final byte[] decodedBytes = Decoders.BASE64.decode(base64Credentials);

			log.info("successfully parsed header credentials");
			return new String(decodedBytes).split(":", 2);
		} catch (Exception exception) {
			log.error("failed to parse authentication header credentials: {}",
				exception.getMessage());
			throw new AuthenticationException("error parsing authentication header credentials");
		}
	}

}

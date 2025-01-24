package com.passplz.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.passplz.config.Role;
import com.passplz.config.TokenType;
import com.passplz.dto.AuthenticationDto;
import com.passplz.entity.PasswordEntry;
import com.passplz.entity.User;
import com.passplz.exception.ApplicationException;
import com.passplz.exception.AuthenticationException;
import com.passplz.service.AuthenticationService;
import com.passplz.service.JwtService;
import com.passplz.service.PasswordEntryService;
import com.passplz.service.TokenService;
import com.passplz.service.UserService;

import io.jsonwebtoken.io.Decoders;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

	@Value("${security.jwt.refreshExpirationMinutes}")
	private String jwtRefreshExpirationMinutes;

	private final JwtService jwtService;
	private final UserService userService;
	private final TokenService tokenService;
	private final PasswordEntryService passwordEntryService;
	private final AuthenticationManager authenticationManager;

	private static final String BASIC = "basic";
	private static final String BEARER = "bearer";

	@Override
	public AuthenticationDto register(HttpServletRequest request) {
		final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
		validateAuthHeader(authHeader, BASIC);

		final String[] credentials = getCredentialsFromHeader(authHeader);
		final User user = User.builder()
			.email(credentials[0])
			.masterPassword(credentials[1])
			.build();

		userService.createUser(user);
		final String accessToken = jwtService.generateToken(user);
		final String refreshToken = jwtService.generateRefreshToken(user);

		tokenService.saveToken(user,
			TokenType.REFRESH,
			Long.parseLong(jwtRefreshExpirationMinutes),
			refreshToken);

		log.info("successfully registered user {} with id {}", user.getUsername(), user.getId());
		return new AuthenticationDto(accessToken, refreshToken);
	}

	@Override
	public AuthenticationDto authenticate(HttpServletRequest request) {
		final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
		validateAuthHeader(authHeader, BASIC);

		final String[] credentials = getCredentialsFromHeader(authHeader);
		final String email = credentials[0];
		final String password = credentials[1];

		final User user = userService.getUserByEmail(email);
		if (user == null) {
			log.error("user not found with email: {}", email);
			throw new AuthenticationException("user not found");
		} else if (!user.getIsVerified()) {
			log.error("user {} is not verified", email);
			throw new AuthenticationException("user is not verified");
		}

		try {
			authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(email, password));
		} catch (Exception exception) {
			log.error("error in authentication manager: {}", exception.getMessage());
			throw new AuthenticationException("error authenticating credentials");
		}

		final String accessToken = jwtService.generateToken(user);
		final String refreshToken = jwtService.generateRefreshToken(user);

		tokenService.saveToken(user,
			TokenType.REFRESH,
			Long.parseLong(jwtRefreshExpirationMinutes),
			refreshToken);

		log.info("successfully authenticated user with id {}", user.getId());
		return new AuthenticationDto(accessToken, refreshToken);
	}

	@Override
	public AuthenticationDto refreshToken(HttpServletRequest request) {
		final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
		validateAuthHeader(authHeader, BEARER);

		final String refreshToken = authHeader.substring("bearer ".length()).trim();
		final String userEmail = jwtService.extractUsername(refreshToken);
		final User user = userService.getUserByEmail(userEmail);

		if (!jwtService.isTokenValid(refreshToken, user)) {
			log.error("token is not valid");
			tokenService.invalidateToken(refreshToken, TokenType.REFRESH);
			tokenService.deleteExpiredTokens();
			throw new AuthenticationException("token is not valid");
		}

		final String accessToken = jwtService.generateToken(user);
		log.info("successfully refreshed token for user user with id {}", user.getId());
		return new AuthenticationDto(accessToken, null);
	}

	@Override
	public void logout(HttpServletRequest request) {
		final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
		validateAuthHeader(authHeader, BEARER);

		final String refreshToken = authHeader.substring("bearer ".length()).trim();
		final User user = tokenService.findUser(refreshToken, TokenType.REFRESH);

		tokenService.invalidateAllTokensForUser(user);
		tokenService.deleteExpiredTokens();
		log.info("successfully logged out user user with id {}", user.getId());
	}

	public void verifyUser(Long userId) {
		log.info("verifying user with id {}", userId);
		final User authenticatedUser = getAuthenticatedUser();
		if (authenticatedUser.getRole().equals(Role.ROLE_ADMIN)) {
			log.info("the user is an admin");
			return;
		}

		if (!authenticatedUser.getId().equals(userId)) {
			log.error("user {} is not authorized to act on user's {} behalf",
				authenticatedUser.getId(),
				userId);
			throw new AuthenticationException(
				String.format("user %s is not authorized to act on user's %s behalf",
					authenticatedUser.getId(),
					userId));
		}
	}

	public void verifyOwnership(Long userId, Long passwordEntryId) {
		log.info("verifying user with id {} is owner of password entry with id {}",
			userId,
			passwordEntryId);
		final User authenticatedUser = getAuthenticatedUser();
		if (authenticatedUser.getRole().equals(Role.ROLE_ADMIN)) {
			log.info("the user has an admin authorization");
			return;
		}

		verifyUser(userId);
		final PasswordEntry entry = passwordEntryService.getEntryById(passwordEntryId);
		if (entry == null) {
			log.warn("couldn't fetch password entry with id {}", passwordEntryId);
		} else if (!userId.equals(entry.getUser().getId())) {
			log.error("user {} doesn't own password entry with id {}", userId, passwordEntryId);
			throw new ApplicationException(
				String.format("user %s doesn't own password entry with id %s",
					userId,
					passwordEntryId));
		}
	}

	public void verifyOwnership(Long passwordEntryId) {
		log.info("verifying ownership of password entry with id {}", passwordEntryId);
		final User authenticatedUser = getAuthenticatedUser();
		if (authenticatedUser.getRole().equals(Role.ROLE_ADMIN)) {
			log.info("the user has an admin authorization");
			return;
		}

		final PasswordEntry entry = passwordEntryService.getEntryById(passwordEntryId);
		if (entry == null) {
			log.warn("couldn't fetch password entry with id {}", passwordEntryId);
		} else if (!authenticatedUser.getId().equals(entry.getUser().getId())) {
			log.error("user {} doesn't own password entry with id {}",
				authenticatedUser.getId(),
				passwordEntryId);
			throw new ApplicationException(
				String.format("user %s doesn't own password entry with id %s",
					authenticatedUser.getId(),
					passwordEntryId));
		}
	}

	private User getAuthenticatedUser() {
		final Authentication authentication = SecurityContextHolder.getContext()
			.getAuthentication();
		if (authentication == null || !authentication.isAuthenticated()) {
			log.warn("user is not authenticated for user confirmation");
			throw new AuthenticationException("user is not authenticated for user confirmation");
		}

		final String authenticatedEmail = authentication.getName();
		return userService.getUserByEmail(authenticatedEmail);
	}

	private static void validateAuthHeader(String authHeader, String authType) {
		if (authHeader == null || !authHeader.toLowerCase().startsWith(authType)) {
			log.error("error validating authentication {} header", authType);
			throw new AuthenticationException(
				String.format("error validating authentication %s header", authHeader));
		}

		log.info("{} authentication header validated", authType);
	}

	private static String[] getCredentialsFromHeader(String authHeader) {
		try {
			final String base64Credentials = authHeader.substring((BASIC + " ").length()).trim();
			final byte[] decodedBytes = Decoders.BASE64.decode(base64Credentials);

			log.info("successfully parsed header credentials");
			return new String(decodedBytes).split(":", 2);
		} catch (Exception exception) {
			log.error("failed to parse authentication header credentials: {}",
				exception.getMessage());
			throw new AuthenticationException("failed to parse authentication header credentials");
		}
	}

}

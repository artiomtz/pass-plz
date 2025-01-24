package com.passplz.config;

import java.io.IOException;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.passplz.entity.User;
import com.passplz.exception.AuthenticationException;
import com.passplz.service.JwtService;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest request,
        @NonNull HttpServletResponse response,
        @NonNull FilterChain filterChain) throws ServletException, IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (authHeader == null || !authHeader.toLowerCase().startsWith("bearer")) {
            log.warn("couldn't locate authentication bearer header");
            filterChain.doFilter(request, response);
            return;
        }

        try {
            final String jwt = authHeader.substring("bearer ".length()).trim();
            final String userEmail = jwtService.extractUsername(jwt);

            if (userEmail != null
                && SecurityContextHolder.getContext().getAuthentication() == null) {
                final User user = (User) userDetailsService.loadUserByUsername(userEmail);

                if (!user.getIsVerified()) {
                    log.warn("user {} is not verified", userEmail);
                    throw new AuthenticationException("user is not verified");
                }

                if (jwtService.isTokenValid(jwt, user)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        user,
                        null,
                        user.getAuthorities());
                    authToken
                        .setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    log.info("authentication context set for {}", userEmail);
                } else {
                    log.warn("invalid token for {}", userEmail);
                    throw new AuthenticationException("invalid token");
                }

            } else {
                log.warn("skipping security context for {}", userEmail);
            }

        } catch (AuthenticationException exception) {
            log.error("authentication failed: {}", exception.getMessage());
            writeErrorResponse(response, HttpStatus.FORBIDDEN.value(), "authentication failed");
            return;
        } catch (ExpiredJwtException exception) {
            log.warn("jwt token has expired");
            writeErrorResponse(response, HttpStatus.UNAUTHORIZED.value(), "jwt token has expired");
            return;
        } catch (Exception exception) {
            log.error("error configuring security context: {}", exception.getMessage());
            writeErrorResponse(response,
                HttpStatus.UNAUTHORIZED.value(),
                "error configuring security context");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private void writeErrorResponse(
        HttpServletResponse response,
        int status,
        String errorMessage) throws IOException {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write(String.format("{\"error\": \"%s\"}", errorMessage));
    }

}

package com.passplz.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    @Value("${spring.config.activate.profile}")
    private String profile;

    @Value("${application.servers.frontend}")
    private String frontendUrl;

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(request -> {
                CorsConfiguration config = new CorsConfiguration();
                String origin = request.getHeader("Origin");
                if (origin == null) {
                    log.warn("cors request without Origin header");
                }

                if (profile.equalsIgnoreCase("local")) {
                    config.setAllowedOrigins(
                        List.of(frontendUrl, "http://localhost", "http://127.0.0.1"));
                    log.info("cors configured hosts for local testing: {}",
                        config.getAllowedOrigins());
                } else {
                    config.setAllowedOrigins(List.of(frontendUrl));
                    log.info("cors configured hosts for production: {}",
                        config.getAllowedOrigins());
                }

                config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
                config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
                config.setExposedHeaders(List.of("Authorization"));
                config.setAllowCredentials(true);
                return config;
            }))
            .headers(headers -> {
                headers.contentSecurityPolicy(policy -> policy.policyDirectives(
                    "default-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'none'"));
                headers.frameOptions(frame -> frame.sameOrigin());
            })
            .securityMatcher("/api/**")
            .authorizeHttpRequests(request -> {
                request.requestMatchers("/api/auth/**", "/api/email/**", "/swagger-ui/**")
                    .permitAll()
                    .anyRequest()
                    .authenticated();
            })
            .sessionManagement(session -> {
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
            })
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .logout(logOut -> {
                logOut.clearAuthentication(true)
                    .invalidateHttpSession(true)
                    .logoutSuccessHandler(
                        (request, response, authentication) -> SecurityContextHolder
                            .clearContext());
            });

        return http.build();
    }

}

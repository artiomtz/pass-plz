package com.passplz.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.passplz.entity.User;
import com.passplz.exception.ApplicationException;
import com.passplz.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public UserDetailsService userDetailsService() {
        return email -> {
            final User user = userService.getUserByEmail(email);
            if (user == null) {
                log.error("error finding user {} in database", email);
                throw new ApplicationException(
                    String.format("error finding user %s in database", email));
            }

            log.info("found user {} in database", email);
            return user;
        };
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsService());
        authenticationProvider.setPasswordEncoder(passwordEncoder);

        return authenticationProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
        AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

}

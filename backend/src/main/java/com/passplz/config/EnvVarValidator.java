package com.passplz.config;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import com.passplz.exception.ApplicationException;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Getter
@Component
public class EnvVarValidator implements BeanFactoryPostProcessor {

    private final Map<String, String> optionalVars = Map.ofEntries(
        Map.entry("USER_PASSWORD_MIN_LENGTH", "12"),
        Map.entry("JWT_EXPIRY_MINUTES", "15"),
        Map.entry("JWT_REFRESH_EXPIRY_MINUTES", "60"),
        Map.entry("EMAIL_KEY", "email-api-key"),
        Map.entry("EMAIL_HOST", "admin@email.com"),
        Map.entry("EMAIL_BANNER", "Email Banner"),
        Map.entry("EMAIL_TOKEN_EXPIRY_MINUTES", "15"));

    private final String[] essentialVars = { "ADMIN_EMAIL", "ADMIN_PASSWORD", "DB_USERNAME",
            "DB_PASSWORD", "DB_URL", "AES_ENCRYPTION_KEY", "JWT_ENCRYPTION_KEY", "LOGS_PATH",
            "LOGS_NUM_KEEP", "LOGS_FILE_SIZE_LIMIT", "LOGS_ALL_SIZE_LIMIT", "FRONTEND_URL",
            "BACKEND_URL" };

    @Override
    public void postProcessBeanFactory(@NonNull ConfigurableListableBeanFactory beanFactory) {
        log.info("validating environment variables");

        final Map<String, Object> defaults = new HashMap<>();
        final ConfigurableEnvironment env = beanFactory.getBean(ConfigurableEnvironment.class);

        for (String key : essentialVars) {
            final String value = System.getenv(key);

            if (value == null || value.isBlank()) {
                throw new ApplicationException("missing required environment variable: " + key);
            }

        }

        optionalVars.forEach((key, defaultValue) -> {
            final String value = System.getenv(key);

            if (value == null || value.isBlank()) {
                log.warn("environment variable '{}' is missing - using default fallback: '{}'",
                    key,
                    defaultValue);
                defaults.put(key, defaultValue);
            }

            if (!defaults.isEmpty()) {
                env.getPropertySources()
                    .addFirst(new MapPropertySource("envVarDefaults", defaults));
            }
        });

        log.info("environment variable validation complete");
    }

}

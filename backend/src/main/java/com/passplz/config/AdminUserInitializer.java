package com.passplz.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.passplz.entity.User;
import com.passplz.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class AdminUserInitializer implements CommandLineRunner {

    @Value("${application.admin.email}")
    private String adminEmail;

    @Value("${application.admin.password}")
    private String adminPassword;

    private final UserService userService;

    @Override
    public void run(String... args) {
        log.info("initializing admin user: {}", adminEmail);
        User adminUser = new User();

        adminUser.setEmail(adminEmail);
        adminUser.setMasterPassword(adminPassword);

        userService.createAdmin(adminUser);
        log.info("admin user initialized: {}", adminEmail);
    }

}

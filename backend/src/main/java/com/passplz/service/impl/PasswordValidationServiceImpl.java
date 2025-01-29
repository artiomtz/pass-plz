package com.passplz.service.impl;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.passplz.exception.ValidationException;
import com.passplz.service.PasswordValidationService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class PasswordValidationServiceImpl implements PasswordValidationService {

    @Value("${security.userPasswordMinLength}")
    private String userPasswordMinLength;

    @Override
    public void validatePassword(String password) {
        if (StringUtils.isBlank(password)) {
            log.error("new password cannot be blank");
            throw new ValidationException("new password cannot be blank");
        }

        if (password.length() < Integer.parseInt(userPasswordMinLength)) {
            log.error("new password must be at least {} characters long", userPasswordMinLength);
            throw new ValidationException(
                String.format("new password must be at least %s characters long",
                    userPasswordMinLength));
        }

        if (!password.matches(".*[A-Z].*")) {
            log.error("new password must contain at least one uppercase letter");
            throw new ValidationException(
                "new password must contain at least one uppercase letter");
        }

        if (!password.matches(".*[a-z].*")) {
            log.error("new password must contain at least one lowercase letter");
            throw new ValidationException(
                "new password must contain at least one lowercase letter");
        }

        if (!password.matches(".*\\d.*")) {
            log.error("new password must contain at least one digit");
            throw new ValidationException("new password must contain at least one digit");
        }

        if (!password.matches(".*[@#$%^&+=!(){}\\[\\]:;<>,.?/~_\\-].*")) {
            log.error("new password must contain at least one special character");
            throw new ValidationException(
                "new password must contain at least one special character");
        }
    }

}

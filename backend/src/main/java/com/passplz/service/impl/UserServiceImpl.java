package com.passplz.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.passplz.config.EmailType;
import com.passplz.config.Role;
import com.passplz.entity.User;
import com.passplz.exception.ApplicationException;
import com.passplz.exception.ValidationException;
import com.passplz.repository.UserRepository;
import com.passplz.service.EmailService;
import com.passplz.service.PasswordValidationService;
import com.passplz.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final EmailService emailService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordValidationService passwordValidationService;

    @Override
    public List<User> getAllUsers() {
        try {
            return userRepository.findAll();
        } catch (Exception exception) {
            log.error("error fetching users: {}", exception.getMessage());
            throw new ApplicationException("error fetching users");
        }
    }

    @Override
    public User getUserById(Long id) {
        try {
            return userRepository.findById(id).orElse(null);
        } catch (Exception exception) {
            log.error("error fetching user with id {}: {}", id, exception.getMessage());
            throw new ApplicationException(String.format("error fetching user with id %d", id));
        }
    }

    @Override
    public User getUserByEmail(String email) {
        try {
            return userRepository.findByEmail(email).orElse(null);
        } catch (Exception exception) {
            log.error("error fetching the user {} by email: {}", email, exception.getMessage());
            throw new ApplicationException(
                String.format("error fetching the user %s by email", email));
        }
    }

    @Override
    public User createUser(User user) {
        try {
            if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                log.warn("user with the email {} already exists", user.getEmail());
                throw new ApplicationException(
                    String.format("user with the email %s already exists", user.getEmail()));
            }

            passwordValidationService.validatePassword(user.getMasterPassword());
            user.setRole(Role.ROLE_USER);
            user.setIsVerified(false);
            user.setCreatedAt(LocalDateTime.now());
            user.setLastVisited(LocalDateTime.now());
            user.setMasterPassword(passwordEncoder.encode(user.getMasterPassword()));

            final User createdUser = userRepository.save(user);
            log.info("created new user with id {}. sending verification email",
                createdUser.getId());

            emailService.sendEmail(createdUser, EmailType.VERIFICATION);
            emailService
                .sendAdminEmail(String.format("New user %s has been created.", user.getEmail()));
            return createdUser;
        } catch (ValidationException exception) {
            log.error("error validating new user password: {}", exception.getMessage());
            throw new ValidationException(
                String.format("error validating new user password: %s", exception.getMessage()));
        } catch (Exception exception) {
            log.error("error creating user: {}", exception.getMessage());
            throw new ApplicationException(
                String.format("error creating user %s", user.getEmail()));
        }
    }

    @Override
    public User createAdmin(User user) {
        try {
            if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                log.warn("admin user with the email {} already exists", user.getEmail());
                return null;
            }

            passwordValidationService.validatePassword(user.getMasterPassword());
            user.setRole(Role.ROLE_ADMIN);
            user.setIsVerified(true);
            user.setCreatedAt(LocalDateTime.now());
            user.setLastVisited(LocalDateTime.now());
            user.setMasterPassword(passwordEncoder.encode(user.getMasterPassword()));

            final User adminUser = userRepository.save(user);
            log.info("created admin user with id {}", adminUser.getId());

            return adminUser;
        } catch (ValidationException exception) {
            log.error("error validating new admin password: {}", exception.getMessage());
            return null;
        } catch (Exception exception) {
            log.error("error creating admin user: {}", exception.getMessage());
            return null;
        }
    }

    @Override
    public User updateUser(Long id, User updatedUser) {
        try {
            return userRepository.findById(id).map(existingUser -> {
                passwordValidationService.validatePassword(updatedUser.getMasterPassword());
                existingUser.setEmail(updatedUser.getEmail());

                if (!passwordEncoder.matches(updatedUser.getMasterPassword(),
                    existingUser.getMasterPassword())) {
                    existingUser
                        .setMasterPassword(passwordEncoder.encode(updatedUser.getMasterPassword()));
                }

                return userRepository.save(existingUser);
            }).orElse(null);
        } catch (ValidationException exception) {
            log.error("error validating new password: {}", exception.getMessage());
            throw new ValidationException(
                String.format("error validating new password: %s", exception.getMessage()));
        } catch (Exception exception) {
            log.error("error updating user with id {}: {}", id, exception.getMessage());
            throw new ApplicationException(String.format("error updating user with id %d", id));
        }
    }

    @Override
    public void updateUserIsVerified(Long id, boolean isVerified) {
        try {
            userRepository.findById(id).ifPresent(user -> {
                user.setIsVerified(isVerified);
                userRepository.save(user);
            });
        } catch (Exception exception) {
            log.error("error updating verification status for user with id {}: {}",
                id,
                exception.getMessage());
            throw new ApplicationException(
                String.format("error updating verification status for user with id %d", id));
        }
    }

    @Override
    public User updateLogin(Long id) {
        try {
            return userRepository.findById(id).map(user -> {
                user.setLastVisited(LocalDateTime.now());
                return userRepository.save(user);
            }).orElse(null);
        } catch (Exception exception) {
            log.error("error updating user with id {} login time: {}", id, exception.getMessage());
            throw new ApplicationException(
                String.format("error updating user with id %d login time", id));
        }
    }

    @Override
    public void deleteUser(User user) {
        try {
            userRepository.delete(user);
            emailService
                .sendAdminEmail(String.format("User %s has been deleted.", user.getEmail()));
        } catch (Exception exception) {
            log.error("error deleting user {}: {}", user.getEmail(), exception.getMessage());
            throw new ApplicationException(
                String.format("error deleting user %s", user.getEmail()));
        }
    }

    @Override
    public boolean deleteUser(Long id) {
        try {
            return userRepository.findById(id).map(user -> {
                userRepository.delete(user);
                return true;
            }).orElse(false);
        } catch (Exception exception) {
            log.error("error deleting user with id {}: {}", id, exception.getMessage());
            throw new ApplicationException(String.format("error deleting user with id %d", id));
        }
    }

}

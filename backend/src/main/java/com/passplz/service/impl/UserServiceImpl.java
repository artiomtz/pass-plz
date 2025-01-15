package com.passplz.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.passplz.config.EmailType;
import com.passplz.config.Role;
import com.passplz.entity.User;
import com.passplz.exception.ApplicationException;
import com.passplz.repository.UserRepository;
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
            throw new ApplicationException(String.format("error fetching the user with id %d", id));
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
                log.warn("a user with the email {} already exists", user.getEmail());
                throw new ApplicationException(
                    String.format("a user with the email %s already exists", user.getEmail()));
            }

            user.setRole(Role.ROLE_USER);
            user.setIsVerified(false);
            user.setCreatedAt(LocalDateTime.now());
            user.setLastVisited(LocalDateTime.now());
            user.setMasterPassword(passwordEncoder.encode(user.getMasterPassword()));
            final User createdUser = userRepository.save(user);

            log.info("created new user with id {}. sending verification email",
                createdUser.getId());
            emailService.sendEmail(createdUser, EmailType.VERIFICATION);
            return createdUser;
        } catch (Exception exception) {
            log.error("error creating user: {}", exception.getMessage());
            throw new ApplicationException(
                String.format("error creating the user %s", user.getEmail()));
        }
    }

    @Override
    public User updateUser(Long id, User updatedUser) {
        try {
            return userRepository.findById(id).map(existingUser -> {
                existingUser.setEmail(updatedUser.getEmail());
                if (!passwordEncoder.matches(updatedUser.getMasterPassword(),
                    existingUser.getMasterPassword())) {
                    existingUser
                        .setMasterPassword(passwordEncoder.encode(updatedUser.getMasterPassword()));
                }
                return userRepository.save(existingUser);
            }).orElse(null);
        } catch (Exception exception) {
            log.error("error updating user with id {}: {}", id, exception.getMessage());
            throw new ApplicationException(String.format("error updating the user with id %d", id));
        }
    }

    @Override
    public void updateIsVerified(Long id, boolean isVerified) {
        try {
            userRepository.findById(id).ifPresent(user -> {
                user.setIsVerified(isVerified);
                userRepository.save(user);
            });
        } catch (Exception exception) {
            log.error("error updating isVerified for user with id {}: {}",
                id,
                exception.getMessage());
            throw new ApplicationException(
                String.format("error updating isVerified for user with id %d", id));
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
            throw new ApplicationException(String.format("error updating user %d login time", id));
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
            throw new ApplicationException(String.format("error deleting the user with id %d", id));
        }
    }

}

package com.passplz.service.impl;

import com.passplz.model.User;
import com.passplz.repository.UserRepository;
import com.passplz.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public User createUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public User updateUser(Long id, User userDetails) {
        return userRepository.findById(id).map(user -> {
            user.setEmail(userDetails.getEmail());
            user.setMasterPassword(userDetails.getMasterPassword());
            return userRepository.save(user);
        }).orElse(null);
    }

    @Override
    public User updateLogin(Long id) {
        return userRepository.findById(id).map(user -> {
            user.setLastVisited(LocalDateTime.now());
            return userRepository.save(user);
        }).orElse(null);
    }

    @Override
    public boolean deleteUser(Long id) {
        return userRepository.findById(id).map(user -> {
            userRepository.delete(user);
            return true;
        }).orElse(false);
    }
}

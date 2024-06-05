package com.passplz.service;

import com.passplz.model.User;

import java.util.List;

public interface UserService {

    List<User> getAllUsers();

    User getUserById(Long id);

    User createUser(User user);

    User updateUser(Long id, User userDetails);

    User updateLogin(Long id);

    boolean deleteUser(Long id);
}

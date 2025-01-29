package com.passplz.service;

import java.util.List;

import com.passplz.entity.User;

public interface UserService {

    List<User> getAllUsers();

    User getUserById(Long id);

    User getUserByEmail(String email);

    User createUser(User user);

    User createAdmin(User user);

    User updateUser(Long id, User userUpdated);

    void updateUserIsVerified(Long id, boolean isVerified);

    User updateLogin(Long id);

    boolean deleteUser(Long id);

}

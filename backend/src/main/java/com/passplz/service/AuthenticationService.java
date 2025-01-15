package com.passplz.service;

import com.passplz.dto.AuthenticationDto;

import jakarta.servlet.http.HttpServletRequest;

public interface AuthenticationService {

    AuthenticationDto register(HttpServletRequest request);

    AuthenticationDto authenticate(HttpServletRequest request);

    AuthenticationDto refreshToken(HttpServletRequest request);

    void logout(HttpServletRequest request);

}

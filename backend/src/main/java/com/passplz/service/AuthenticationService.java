package com.passplz.service;

import com.passplz.dto.AuthenticationDto;

import jakarta.servlet.http.HttpServletRequest;

public interface AuthenticationService {

    public AuthenticationDto register(HttpServletRequest request);

    public AuthenticationDto authenticate(HttpServletRequest request);

    public AuthenticationDto refreshToken(HttpServletRequest request);

}

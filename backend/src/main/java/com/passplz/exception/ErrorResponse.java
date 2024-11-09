package com.passplz.exception;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ErrorResponse {

    private final int code;
    private final String status;
    private final String message;
    private final LocalDateTime timestamp;

    public ErrorResponse(int code, String status, String message) {
        this.code = code;
        this.status = status;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }

}

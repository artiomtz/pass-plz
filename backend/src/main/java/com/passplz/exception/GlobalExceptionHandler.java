package com.passplz.exception;

import java.time.format.DateTimeParseException;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.passplz.service.EmailService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@ControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {

    private final EmailService emailService;

    @ExceptionHandler(ApplicationException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ApplicationException exception) {
        log.error("caught application exception: {}", exception.getMessage());
        emailService.sendAdminEmail(
            String.format("The backend server has encountered an application exception:%n%s",
                exception.getMessage()));

        final ErrorResponse error = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            "APPLICATION_ERROR",
            exception.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleJwtAuthenticationException(
        AuthenticationException exception) {
        log.error("caught authentication exception: {}", exception.getMessage());

        final ErrorResponse error = new ErrorResponse(
            HttpStatus.UNAUTHORIZED.value(),
            "AUTHENTICATION_ERROR",
            exception.getMessage());
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(AuthorizationDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAuthorizationDeniedException(
        AuthorizationDeniedException exception) {
        log.error("caught authorization exception: {}", exception.getMessage());

        final ErrorResponse error = new ErrorResponse(
            HttpStatus.UNAUTHORIZED.value(),
            "AUTHORIZATION_ERROR",
            exception.getMessage());
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(InternalAuthenticationServiceException.class)
    public ResponseEntity<ErrorResponse> handleAuthenticationException(
        InternalAuthenticationServiceException exception) {
        final Throwable cause = exception.getCause();

        if (cause instanceof ApplicationException) {
            log.info("caught application exception wrapped by security: {}", cause.getMessage());
            final ErrorResponse error = new ErrorResponse(
                HttpStatus.UNAUTHORIZED.value(),
                "AUTHENTICATION_ERROR",
                cause.getMessage());
            return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
        }

        return handleGeneralException(exception);
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(ValidationException exception) {
        log.error("caught validation exception: {}", exception.getMessage());

        final ErrorResponse error = new ErrorResponse(
            HttpStatus.NOT_ACCEPTABLE.value(),
            "VALIDATION_ERROR",
            exception.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_ACCEPTABLE);
    }

    @ExceptionHandler(DateTimeParseException.class)
    public ResponseEntity<ErrorResponse> handleDateTimeParseException(
        DateTimeParseException exception) {
        log.error("caught date-time validation exception: {}", exception.getMessage());

        ErrorResponse error = new ErrorResponse(
            HttpStatus.NOT_ACCEPTABLE.value(),
            "VALIDATION_ERROR",
            exception.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_ACCEPTABLE);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleHttpMessageNotReadable(
        HttpMessageNotReadableException exception) {
        log.error("caught message format validation exception: {}", exception.getMessage());

        ErrorResponse error = new ErrorResponse(
            HttpStatus.NOT_ACCEPTABLE.value(),
            "VALIDATION_ERROR",
            exception.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_ACCEPTABLE);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(
        MethodArgumentNotValidException exception) {
        log.error("caught argument validation exception: {}", exception.getMessage());

        final String errorMessage = exception.getBindingResult()
            .getAllErrors()
            .stream()
            .map(ObjectError::getDefaultMessage)
            .collect(Collectors.joining(", "));

        final ErrorResponse error = new ErrorResponse(
            HttpStatus.NOT_ACCEPTABLE.value(),
            "VALIDATION_ERROR",
            "validation error: " + errorMessage);
        return new ResponseEntity<>(error, HttpStatus.NOT_ACCEPTABLE);
    }

    @ExceptionHandler(EmailException.class)
    public ResponseEntity<ErrorResponse> handleEmailException(EmailException exception) {
        log.error("caught email exception: {}", exception.getMessage());

        final ErrorResponse error = new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "EMAIL_ERROR",
            exception.getMessage());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneralException(Exception exception) {
        log.error("caught a general exception: {}", exception.getMessage());
        emailService
            .sendAdminEmail(String.format("The backend server has encountered an exception:%n%s",
                exception.getMessage()));

        final ErrorResponse error = new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "INTERNAL_ERROR",
            "An unexpected server error occurred");
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}

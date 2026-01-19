package com.passplz.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.passplz.exception.ErrorResponse;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class ErrorPageController implements ErrorController {

    private final TemplateEngine templateEngine;

    @RequestMapping("/error")
    public ResponseEntity<?> handleError(HttpServletRequest request) {
        final String accept = request.getHeader("Accept");

        if (accept != null && accept.contains("text/html")) {
            Context context = new Context();
            final String htmlBody = templateEngine.process("error-page.html", context);

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .contentType(MediaType.TEXT_HTML)
                .body(htmlBody);
        } else {
            final ErrorResponse error = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "BAD_REQUEST",
                "This path does not exist. Please confirm your authentication");
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }
    }

}

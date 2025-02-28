package com.passplz.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.util.ReflectionTestUtils;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.passplz.config.EmailType;
import com.passplz.config.TokenType;
import com.passplz.entity.User;
import com.passplz.exception.ApplicationException;
import com.passplz.exception.EmailException;
import com.passplz.service.impl.EmailServiceImpl;

class EmailServiceTest {

    @InjectMocks
    private EmailServiceImpl emailService;

    @Mock
    private TemplateEngine templateEngine;

    @Mock
    private TokenService tokenService;

    private User mockUser;

    private static final String EMAIL_TOKEN = "token";
    private static final String EMAIL_CONTENT = "<html>Email Content</html>";

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        ReflectionTestUtils.setField(emailService, "tokenExpiryMinutes", "60");

        mockUser = new User();
        mockUser.setEmail("user@mail.com");
    }

    @Test
    void testSendEmail_Success() {
        when(templateEngine.process(anyString(), any(Context.class))).thenReturn(EMAIL_CONTENT);
        when(tokenService.createToken(any(User.class), any(TokenType.class), anyLong()))
            .thenReturn(EMAIL_TOKEN);

        assertDoesNotThrow(() -> emailService.sendEmail(mockUser, EmailType.VERIFICATION));
    }

    @Test
    void testSendEmail_TemplateProcessingError() {
        when(templateEngine.process(anyString(), any(Context.class)))
            .thenThrow(new EmailException("error processing email template"));

        assertThrows(EmailException.class, () -> emailService.sendEmail(mockUser, EmailType.RESET));
    }

    @Test
    void testSendEmail_TokenCreationError() {
        when(tokenService.createToken(any(User.class), any(TokenType.class), anyLong()))
            .thenThrow(new ApplicationException("error creating token"));

        assertThrows(EmailException.class,
            () -> emailService.sendEmail(mockUser, EmailType.CANCELLATION));
    }

    @Test
    void testSendAdminEmail_Success() {
        when(templateEngine.process(anyString(), any(Context.class))).thenReturn(EMAIL_CONTENT);

        assertDoesNotThrow(() -> emailService.sendAdminEmail("Test admin message"));
    }

    @Test
    void testSendAdminEmail_TemplateProcessingError() {
        when(templateEngine.process(anyString(), any(Context.class)))
            .thenThrow(new EmailException("error processing email template"));

        assertDoesNotThrow(() -> emailService.sendAdminEmail("Test admin message"));
    }

}

package com.passplz.service;

import com.passplz.config.EmailType;
import com.passplz.entity.User;

public interface EmailService {

    void sendEmail(User user, EmailType emailType);

    void sendAdminEmail(String messageText);

}

package com.passplz.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.postmarkapp.postmark.Postmark;
import com.postmarkapp.postmark.client.ApiClient;

@Configuration
public class EmailConfig {

    @Value("${email.api.key}")
    private String postmarkApiKey;

    @Bean
    public ApiClient postmarkClient() {
        return Postmark.getApiClient(postmarkApiKey);
    }

}

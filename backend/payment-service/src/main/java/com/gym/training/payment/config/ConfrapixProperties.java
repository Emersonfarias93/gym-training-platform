package com.gym.training.payment.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "confrapix.api")
public record ConfrapixProperties(
        String baseUrl,
        String token
) {
}

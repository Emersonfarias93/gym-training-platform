package com.gym.training.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;

@AutoConfiguration
public class InternalSecurityAutoConfiguration {
    @Bean
    FilterRegistrationBean<InternalApiKeyFilter> internalApiKeyFilter(
            @Value("${INTERNAL_API_KEY:}") String apiKey) {
        var registration = new FilterRegistrationBean<>(new InternalApiKeyFilter(apiKey));
        registration.setOrder(-100);
        return registration;
    }
}

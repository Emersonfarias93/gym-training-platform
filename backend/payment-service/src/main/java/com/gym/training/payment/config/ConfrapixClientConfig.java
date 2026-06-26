package com.gym.training.payment.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.web.client.RestClient;

@Configuration
@EnableConfigurationProperties(ConfrapixProperties.class)
public class ConfrapixClientConfig {

    @Bean
    RestClient confrapixRestClient(
            RestClient.Builder builder,
            ConfrapixProperties properties,
            ClientHttpRequestInterceptor confrapixBearerTokenInterceptor
    ) {
        return builder
                .baseUrl(properties.baseUrl())
                .requestInterceptor(confrapixBearerTokenInterceptor)
                .build();
    }
}

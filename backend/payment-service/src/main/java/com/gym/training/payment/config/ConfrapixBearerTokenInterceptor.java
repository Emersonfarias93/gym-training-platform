package com.gym.training.payment.config;

import java.io.IOException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class ConfrapixBearerTokenInterceptor implements ClientHttpRequestInterceptor {

    private final ConfrapixProperties properties;

    public ConfrapixBearerTokenInterceptor(ConfrapixProperties properties) {
        this.properties = properties;
    }

    @Override
    public ClientHttpResponse intercept(
            HttpRequest request,
            byte[] body,
            ClientHttpRequestExecution execution
    ) throws IOException {
        if (!StringUtils.hasText(properties.token())) {
            throw new IllegalStateException("Token da API Confrapix nao configurado no backend");
        }

        request.getHeaders().set(HttpHeaders.AUTHORIZATION, "Bearer " + properties.token());
        return execution.execute(request, body);
    }
}

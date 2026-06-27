package com.gym.training.user.service;

import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Component
public class PaymentAccessClient {

    private static final Logger LOGGER = LoggerFactory.getLogger(PaymentAccessClient.class);

    private final RestClient restClient;

    public PaymentAccessClient(
            RestClient.Builder builder,
            @Value("${fitai.services.payment-service-url:${PAYMENT_SERVICE_URL:http://localhost:8083}}") String paymentServiceUrl
    ) {
        this.restClient = builder.baseUrl(paymentServiceUrl).build();
    }

    public Optional<PaymentAccessStatusResponse> getAccessStatus(AuthenticatedUser user) {
        try {
            PaymentAccessStatusResponse response = restClient.get()
                    .uri("/api/v1/payments/access/me")
                    .header("X-User-Id", user.userId().toString())
                    .header("X-User-Email", user.email())
                    .header("X-User-Full-Name", user.fullName())
                    .retrieve()
                    .body(PaymentAccessStatusResponse.class);

            return Optional.ofNullable(response);
        } catch (RestClientException exception) {
            LOGGER.warn("Falha ao consultar acesso premium no payment-service para usuario {}.", user.userId());
            return Optional.empty();
        }
    }
}

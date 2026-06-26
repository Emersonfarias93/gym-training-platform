package com.gym.training.payment.service;

import java.util.UUID;

/**
 * Identidade do usuario que origina a cobranca, vinda dos headers da requisicao
 * (X-User-Id/Email/Full-Name/Plan-Name). Nao e enviada para a Confrapix.
 */
public record PaymentRequester(
        UUID userId,
        String email,
        String fullName,
        String planName
) {
    public boolean hasUserId() {
        return userId != null;
    }
}

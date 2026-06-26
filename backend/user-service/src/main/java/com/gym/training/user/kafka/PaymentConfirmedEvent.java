package com.gym.training.user.kafka;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Evento de pagamento confirmado publicado pelo payment-service no topico
 * `payment.events`. Os campos devem casar com o JSON do producer.
 */
public record PaymentConfirmedEvent(
        UUID eventId,
        Instant occurredAt,
        UUID userId,
        String email,
        String fullName,
        String planName,
        BigDecimal amount,
        String transactionUuid,
        String sourceService
) {
}

package com.gym.training.payment.event;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Evento publicado quando a Confrapix confirma o pagamento de uma cobranca Pix.
 * Consumido pelo user-service para ativar o premium do usuario.
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

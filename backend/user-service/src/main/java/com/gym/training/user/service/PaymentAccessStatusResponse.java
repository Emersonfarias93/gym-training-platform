package com.gym.training.user.service;

import java.time.Instant;
import java.util.UUID;

public record PaymentAccessStatusResponse(
        UUID userId,
        boolean premiumActive,
        String planName,
        String status,
        Instant currentPeriodEnd,
        String lastPaymentTransactionUuid,
        Instant lastSyncedAt
) {
}

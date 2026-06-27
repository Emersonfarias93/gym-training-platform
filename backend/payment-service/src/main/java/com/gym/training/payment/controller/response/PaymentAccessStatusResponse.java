package com.gym.training.payment.controller.response;

import com.gym.training.payment.domain.PremiumAccessStatus;
import java.time.Instant;
import java.util.UUID;

public record PaymentAccessStatusResponse(
        UUID userId,
        boolean premiumActive,
        String planName,
        PremiumAccessStatus status,
        Instant currentPeriodEnd,
        String lastPaymentTransactionUuid,
        Instant lastSyncedAt
) {
}

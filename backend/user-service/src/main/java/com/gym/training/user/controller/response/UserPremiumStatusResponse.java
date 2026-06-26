package com.gym.training.user.controller.response;

import com.gym.training.user.domain.PremiumStatus;
import java.time.Instant;
import java.util.UUID;

public record UserPremiumStatusResponse(
        UUID userId,
        boolean premiumActive,
        String planName,
        PremiumStatus status,
        Instant currentPeriodEnd,
        Instant lastSyncedAt
) {
}

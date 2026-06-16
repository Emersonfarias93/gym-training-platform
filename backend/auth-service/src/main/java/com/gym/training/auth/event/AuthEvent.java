package com.gym.training.auth.event;

import com.gym.training.auth.domain.UserRole;
import java.time.Instant;
import java.util.UUID;

public record AuthEvent(
        UUID eventId,
        AuthEventType eventType,
        Instant occurredAt,
        UUID userId,
        String email,
        UserRole role,
        String sourceService
) {
}

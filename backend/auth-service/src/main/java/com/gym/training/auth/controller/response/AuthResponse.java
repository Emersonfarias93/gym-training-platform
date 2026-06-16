package com.gym.training.auth.controller.response;

import com.gym.training.auth.domain.UserRole;
import java.time.Instant;
import java.util.UUID;

public record AuthResponse(
        UUID userId,
        String fullName,
        String email,
        UserRole role,
        String accessToken,
        String tokenType,
        Instant expiresAt
) {
}

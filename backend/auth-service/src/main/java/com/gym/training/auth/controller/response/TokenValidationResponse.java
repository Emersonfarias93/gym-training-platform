package com.gym.training.auth.controller.response;

import com.gym.training.auth.domain.UserRole;
import java.util.UUID;

public record TokenValidationResponse(
        boolean valid,
        UUID userId,
        String email,
        UserRole role
) {
}

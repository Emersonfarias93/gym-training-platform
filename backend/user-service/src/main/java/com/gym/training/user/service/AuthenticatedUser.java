package com.gym.training.user.service;

import java.util.UUID;

public record AuthenticatedUser(
        UUID userId,
        String email,
        String fullName
) {
}

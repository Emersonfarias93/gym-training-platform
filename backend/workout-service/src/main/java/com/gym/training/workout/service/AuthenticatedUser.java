package com.gym.training.workout.service;

import java.util.UUID;

public record AuthenticatedUser(
        UUID userId,
        String email,
        String fullName
) {
}

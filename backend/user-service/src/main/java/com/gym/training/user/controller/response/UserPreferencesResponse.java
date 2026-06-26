package com.gym.training.user.controller.response;

import com.gym.training.user.domain.MeasurementSystem;
import java.time.Instant;
import java.util.UUID;

public record UserPreferencesResponse(
        UUID userId,
        String language,
        String timezone,
        MeasurementSystem measurementSystem,
        boolean notificationsEnabled,
        boolean emailNotificationsEnabled,
        boolean pushNotificationsEnabled,
        boolean aiCoachPersonalizationEnabled,
        Instant updatedAt
) {
}

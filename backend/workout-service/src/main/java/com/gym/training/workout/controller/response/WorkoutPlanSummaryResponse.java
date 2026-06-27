package com.gym.training.workout.controller.response;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record WorkoutPlanSummaryResponse(
        UUID id,
        String title,
        String goal,
        String origin,
        String status,
        boolean active,
        LocalDate scheduledDate,
        String intensity,
        Integer estimatedDurationMinutes,
        int sessionCount,
        int exerciseCount,
        Instant createdAt
) {
}

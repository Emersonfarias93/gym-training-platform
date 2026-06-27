package com.gym.training.workout.controller.response;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record WorkoutPlanDetailResponse(
        UUID id,
        String title,
        String goal,
        String origin,
        String status,
        boolean active,
        Instant createdAt,
        List<WorkoutSessionDetailResponse> sessions
) {
}

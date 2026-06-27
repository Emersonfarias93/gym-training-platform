package com.gym.training.workout.controller.response;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record WorkoutSessionDetailResponse(
        UUID id,
        String title,
        LocalDate scheduledDate,
        String status,
        Integer estimatedDurationMinutes,
        String intensity,
        Integer sortOrder,
        List<WorkoutExerciseDetailResponse> exercises
) {
}

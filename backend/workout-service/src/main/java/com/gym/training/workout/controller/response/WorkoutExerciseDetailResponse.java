package com.gym.training.workout.controller.response;

import java.util.UUID;

public record WorkoutExerciseDetailResponse(
        UUID id,
        String name,
        String setsDescription,
        String repsDescription,
        Integer restSeconds,
        String loadSuggestion,
        String executionNotes,
        Integer progressPercent,
        Integer sortOrder
) {
}

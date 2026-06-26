package com.gym.training.workout.controller.response;

import java.util.UUID;

public record WorkoutExerciseProgressResponse(
        UUID id,
        String name,
        String sets,
        int progress
) {
}

package com.gym.training.workout.controller.request;

import jakarta.validation.constraints.Size;

public record GenerateWorkoutRequest(
        @Size(max = 120) String focus
) {
}

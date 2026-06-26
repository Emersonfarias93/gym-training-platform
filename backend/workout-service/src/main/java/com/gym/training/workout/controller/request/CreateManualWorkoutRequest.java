package com.gym.training.workout.controller.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateManualWorkoutRequest(
        @NotBlank @Size(max = 140) String title,
        @NotBlank @Size(max = 80) String goal,
        @NotNull @Valid ManualWorkoutSessionRequest session
) {
}

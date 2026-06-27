package com.gym.training.workout.controller.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;

public record UpdateWorkoutPlanRequest(
        @NotBlank @Size(max = 140) String title,
        @NotBlank @Size(max = 80) String goal,
        @NotEmpty @Size(max = 7) List<@Valid ManualWorkoutSessionRequest> sessions
) {
}

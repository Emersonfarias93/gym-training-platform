package com.gym.training.workout.controller.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;

public record ManualWorkoutSessionRequest(
        @NotBlank @Size(max = 140) String title,
        @NotNull LocalDate scheduledDate,
        @NotNull @Min(15) @Max(240) Integer estimatedDurationMinutes,
        @NotBlank @Size(max = 40) String intensity,
        @NotEmpty @Size(max = 12) List<@Valid ManualWorkoutExerciseRequest> exercises
) {
}

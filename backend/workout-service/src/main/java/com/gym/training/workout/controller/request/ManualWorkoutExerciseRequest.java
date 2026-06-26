package com.gym.training.workout.controller.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ManualWorkoutExerciseRequest(
        @NotBlank @Size(max = 140) String name,
        @NotBlank @Size(max = 40) String setsDescription,
        @NotBlank @Size(max = 40) String repsDescription,
        @Min(0) @Max(600) Integer restSeconds,
        @Size(max = 120) String loadSuggestion,
        @Size(max = 1000) String executionNotes
) {
}

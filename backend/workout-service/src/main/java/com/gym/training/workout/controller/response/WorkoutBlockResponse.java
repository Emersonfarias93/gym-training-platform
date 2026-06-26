package com.gym.training.workout.controller.response;

import java.util.UUID;

public record WorkoutBlockResponse(
        UUID id,
        String title,
        String subtitle,
        String meta,
        String tone
) {
}

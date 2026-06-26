package com.gym.training.user.controller.response;

import java.util.UUID;

public record UserDashboardContextResponse(
        UUID userId,
        String fullName,
        String email,
        boolean premiumActive,
        String planName,
        String mainGoal,
        String experienceLevel,
        String activityLevel,
        String preferredTrainingTime,
        Integer trainingFrequencyPerWeek
) {
}

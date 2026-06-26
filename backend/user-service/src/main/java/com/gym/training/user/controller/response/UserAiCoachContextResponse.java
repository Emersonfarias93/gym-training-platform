package com.gym.training.user.controller.response;

import java.util.UUID;

public record UserAiCoachContextResponse(
        UUID userId,
        String fullName,
        boolean premiumActive,
        boolean personalizationEnabled,
        String mainGoal,
        String experienceLevel,
        String activityLevel,
        String preferredTrainingTime,
        Integer trainingFrequencyPerWeek,
        String dietaryPreference,
        String foodRestrictions,
        String injuryNotes,
        String medicalNotes
) {
}

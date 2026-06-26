package com.gym.training.workout.service;

public record UserAiCoachContext(
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

    static UserAiCoachContext empty(AuthenticatedUser user) {
        return new UserAiCoachContext(
                user.fullName(),
                false,
                false,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null
        );
    }
}

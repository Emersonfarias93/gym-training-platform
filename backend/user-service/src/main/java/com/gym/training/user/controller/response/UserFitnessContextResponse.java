package com.gym.training.user.controller.response;

import com.gym.training.user.domain.ActivityLevel;
import com.gym.training.user.domain.DietaryPreference;
import com.gym.training.user.domain.FitnessGoal;
import com.gym.training.user.domain.PreferredTrainingTime;
import com.gym.training.user.domain.TrainingExperienceLevel;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record UserFitnessContextResponse(
        UUID userId,
        FitnessGoal mainGoal,
        TrainingExperienceLevel experienceLevel,
        BigDecimal heightCm,
        BigDecimal weightKg,
        ActivityLevel activityLevel,
        Integer trainingFrequencyPerWeek,
        PreferredTrainingTime preferredTrainingTime,
        DietaryPreference dietaryPreference,
        String foodRestrictions,
        String injuryNotes,
        String medicalNotes,
        Instant updatedAt
) {
}

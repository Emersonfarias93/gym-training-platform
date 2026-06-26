package com.gym.training.user.controller.request;

import com.gym.training.user.domain.ActivityLevel;
import com.gym.training.user.domain.DietaryPreference;
import com.gym.training.user.domain.FitnessGoal;
import com.gym.training.user.domain.PreferredTrainingTime;
import com.gym.training.user.domain.TrainingExperienceLevel;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record UpdateUserFitnessContextRequest(
        FitnessGoal mainGoal,
        TrainingExperienceLevel experienceLevel,

        @DecimalMin(value = "80.0", message = "Altura minima invalida")
        @DecimalMax(value = "260.0", message = "Altura maxima invalida")
        BigDecimal heightCm,

        @DecimalMin(value = "25.0", message = "Peso minimo invalido")
        @DecimalMax(value = "350.0", message = "Peso maximo invalido")
        BigDecimal weightKg,

        ActivityLevel activityLevel,

        @Min(value = 0, message = "Frequencia semanal minima invalida")
        @Max(value = 14, message = "Frequencia semanal maxima invalida")
        Integer trainingFrequencyPerWeek,

        PreferredTrainingTime preferredTrainingTime,
        DietaryPreference dietaryPreference,

        @Size(max = 1000, message = "Restricoes alimentares devem ter no maximo 1000 caracteres")
        String foodRestrictions,

        @Size(max = 1000, message = "Observacoes de lesao devem ter no maximo 1000 caracteres")
        String injuryNotes,

        @Size(max = 1000, message = "Observacoes medicas devem ter no maximo 1000 caracteres")
        String medicalNotes
) {
}

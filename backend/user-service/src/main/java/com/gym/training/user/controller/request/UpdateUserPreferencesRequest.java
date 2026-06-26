package com.gym.training.user.controller.request;

import com.gym.training.user.domain.MeasurementSystem;
import jakarta.validation.constraints.Size;

public record UpdateUserPreferencesRequest(
        @Size(min = 2, max = 10, message = "Idioma invalido")
        String language,

        @Size(min = 3, max = 60, message = "Timezone invalido")
        String timezone,

        MeasurementSystem measurementSystem,
        Boolean notificationsEnabled,
        Boolean emailNotificationsEnabled,
        Boolean pushNotificationsEnabled,
        Boolean aiCoachPersonalizationEnabled
) {
}

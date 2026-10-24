package com.gym.training.workout.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gym.training.workout.controller.request.UpdateWorkoutPlanRequest;
import jakarta.validation.Validator;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

@Component
public class GeneratedWorkoutParser {
    private final ObjectMapper objectMapper;
    private final Validator validator;

    public GeneratedWorkoutParser(ObjectMapper objectMapper, Validator validator) {
        this.objectMapper = objectMapper;
        this.validator = validator;
    }

    public UpdateWorkoutPlanRequest parse(String response) {
        if (StringUtils.hasText(response)) {
            String json = response.trim().replaceFirst("^```(?:json)?\\s*", "")
                    .replaceFirst("\\s*```$", "");
            try {
                var workout = objectMapper.readValue(json, UpdateWorkoutPlanRequest.class);
                if (workout != null && validator.validate(workout).isEmpty()) return workout;
            } catch (JsonProcessingException ignored) {
                // Provider output must satisfy the same contract as a manually edited plan.
            }
        }
        throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                "Não foi possível gerar um treino válido. Tente novamente ou crie uma ficha manual.");
    }
}

package com.gym.training.workout.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Validation;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

class GeneratedWorkoutParserTest {
    private final String validJson = """
        {"title":"Treino personalizado", "goal":"Força", "sessions":[{
          "title":"Treino A", "scheduledDate":"2026-10-24", "estimatedDurationMinutes":45,
          "intensity":"Moderada", "exercises":[{"name":"Remada", "setsDescription":"3",
          "repsDescription":"12", "restSeconds":60, "executionNotes":"Execução controlada"}]}]}
        """;

    @Test
    void preservesActualExercisesReturnedByProvider() {
        try (var factory = Validation.buildDefaultValidatorFactory()) {
            var parser = new GeneratedWorkoutParser(new ObjectMapper().findAndRegisterModules(), factory.getValidator());
            var plan = parser.parse("```json\n" + validJson + "\n```");
            assertEquals("Remada", plan.sessions().get(0).exercises().get(0).name());
            assertEquals("3", plan.sessions().get(0).exercises().get(0).setsDescription());
        }
    }

    @Test
    void rejectsUnavailableMalformedAndInvalidProviderOutput() {
        try (var factory = Validation.buildDefaultValidatorFactory()) {
            var parser = new GeneratedWorkoutParser(new ObjectMapper().findAndRegisterModules(), factory.getValidator());
            for (String response : new String[]{"", "Aqui está o treino", "null", "{}",
                    validJson.replace("\"restSeconds\":60", "\"restSeconds\":-1"),
                    validJson.replace("\"exercises\":[{", "\"exercises\":[null,{" )}) {
                var error = assertThrows(ResponseStatusException.class, () -> parser.parse(response));
                assertEquals(502, error.getStatusCode().value());
            }
        }
    }
}

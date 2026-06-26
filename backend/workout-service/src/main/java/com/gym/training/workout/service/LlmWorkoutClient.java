package com.gym.training.workout.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Component
public class LlmWorkoutClient {

    private final RestClient restClient;

    public LlmWorkoutClient(
            RestClient.Builder builder,
            @Value("${fitai.services.llm-service-url}") String llmServiceUrl
    ) {
        this.restClient = builder.baseUrl(llmServiceUrl).build();
    }

    public String generateWorkout(AuthenticatedUser user, UserAiCoachContext context, String focus) {
        try {
            LlmResponse response = restClient.post()
                    .uri("/api/llm/generate")
                    .body(new LlmRequest(buildPrompt(user, context, focus)))
                    .retrieve()
                    .body(LlmResponse.class);

            return response == null ? null : response.generation();
        } catch (RestClientException exception) {
            return null;
        }
    }

    private String buildPrompt(AuthenticatedUser user, UserAiCoachContext context, String focus) {
        return """
                Gere um treino de academia para o usuario abaixo. Responda em portugues, de forma estruturada,
                com aquecimento, 5 exercicios principais, series, repeticoes, descanso, intensidade e cuidados.

                Usuario: %s
                Objetivo: %s
                Nivel: %s
                Frequencia semanal: %s
                Preferencia de horario: %s
                Lesoes/observacoes: %s
                Foco solicitado: %s
                """.formatted(
                user.fullName(),
                valueOrFallback(context.mainGoal(), "nao informado"),
                valueOrFallback(context.experienceLevel(), "nao informado"),
                context.trainingFrequencyPerWeek() == null ? "nao informada" : context.trainingFrequencyPerWeek(),
                valueOrFallback(context.preferredTrainingTime(), "flexivel"),
                valueOrFallback(context.injuryNotes(), "nenhuma informada"),
                valueOrFallback(focus, "treino do dia")
        );
    }

    private String valueOrFallback(String value, String fallback) {
        return StringUtils.hasText(value) ? value : fallback;
    }
}

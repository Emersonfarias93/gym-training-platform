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
            @Value("${INTERNAL_API_KEY:}") String internalApiKey,
            @Value("${fitai.services.llm-service-url}") String llmServiceUrl
    ) {
        this.restClient = builder.defaultHeader("X-Internal-Api-Key", internalApiKey).baseUrl(llmServiceUrl).build();
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
                Gere um treino de academia para o usuario abaixo. Responda SOMENTE com JSON, sem Markdown.
                Use de 1 a 7 sessoes e de 1 a 12 exercicios por sessao. Titulos ate 140 caracteres,
                goal ate 80, intensidade ate 40, series/repeticoes ate 40, carga ate 120, observacoes ate 1000.
                Use este contrato e datas no formato yyyy-MM-dd a partir de hoje (%s):
                {"title":"Treino", "goal":"Objetivo", "sessions":[{"title":"Treino A",
                "scheduledDate":"yyyy-MM-dd", "estimatedDurationMinutes":50, "intensity":"Moderada",
                "exercises":[{"name":"Exercicio", "setsDescription":"3", "repsDescription":"10",
                "restSeconds":60, "loadSuggestion":"Carga confortavel", "executionNotes":"Cuidados"}]}]}
                Duracao entre 15 e 240 minutos. Descanso entre 0 e 600 segundos. Nao invente progresso.

                Usuario: %s
                Objetivo: %s
                Nivel: %s
                Frequencia semanal: %s
                Preferencia de horario: %s
                Lesoes/observacoes: %s
                Foco solicitado: %s
                """.formatted(
                java.time.LocalDate.now(),
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

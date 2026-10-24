package com.gym.training.workout.service;

import com.gym.training.workout.controller.request.CreateManualWorkoutRequest;
import com.gym.training.workout.controller.request.GenerateWorkoutRequest;
import com.gym.training.workout.controller.request.ManualWorkoutExerciseRequest;
import com.gym.training.workout.controller.request.ManualWorkoutSessionRequest;
import com.gym.training.workout.controller.request.UpdateWorkoutPlanRequest;
import com.gym.training.workout.controller.response.WorkoutBlockResponse;
import com.gym.training.workout.controller.response.WorkoutExerciseDetailResponse;
import com.gym.training.workout.controller.response.WorkoutExerciseProgressResponse;
import com.gym.training.workout.controller.response.WorkoutOverviewResponse;
import com.gym.training.workout.controller.response.WorkoutPlanDetailResponse;
import com.gym.training.workout.controller.response.WorkoutPlanSummaryResponse;
import com.gym.training.workout.controller.response.WorkoutSessionDetailResponse;
import com.gym.training.workout.domain.WorkoutExercise;
import com.gym.training.workout.domain.WorkoutGenerationStatus;
import com.gym.training.workout.domain.WorkoutPlan;
import com.gym.training.workout.domain.WorkoutPlanStatus;
import com.gym.training.workout.domain.WorkoutSession;
import com.gym.training.workout.domain.WorkoutSessionStatus;
import com.gym.training.workout.exception.WorkoutNotFoundException;
import com.gym.training.workout.repository.WorkoutExerciseRepository;
import com.gym.training.workout.repository.WorkoutPlanRepository;
import com.gym.training.workout.repository.WorkoutSessionRepository;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class WorkoutService {

    private static final DateTimeFormatter SHORT_DATE_FORMATTER =
            DateTimeFormatter.ofPattern("dd/MM", Locale.forLanguageTag("pt-BR"));

    private static final List<WorkoutSessionStatus> ACTIVE_SESSION_STATUSES =
            List.of(WorkoutSessionStatus.SCHEDULED, WorkoutSessionStatus.IN_PROGRESS);

    private final WorkoutPlanRepository workoutPlanRepository;
    private final WorkoutSessionRepository workoutSessionRepository;
    private final WorkoutExerciseRepository workoutExerciseRepository;
    private final UserContextClient userContextClient;
    private final LlmWorkoutClient llmWorkoutClient;
    private final GeneratedWorkoutParser generatedWorkoutParser;

    public WorkoutService(
            WorkoutPlanRepository workoutPlanRepository,
            WorkoutSessionRepository workoutSessionRepository,
            WorkoutExerciseRepository workoutExerciseRepository,
            UserContextClient userContextClient,
            LlmWorkoutClient llmWorkoutClient,
            GeneratedWorkoutParser generatedWorkoutParser
    ) {
        this.workoutPlanRepository = workoutPlanRepository;
        this.workoutSessionRepository = workoutSessionRepository;
        this.workoutExerciseRepository = workoutExerciseRepository;
        this.userContextClient = userContextClient;
        this.llmWorkoutClient = llmWorkoutClient;
        this.generatedWorkoutParser = generatedWorkoutParser;
    }

    @Transactional(readOnly = true)
    public WorkoutOverviewResponse getOverview(AuthenticatedUser user) {
        List<WorkoutSession> programmedSessions =
                workoutSessionRepository.findTop3ByUserIdAndPlan_StatusOrderByScheduledDateAscSortOrderAsc(user.userId(), WorkoutPlanStatus.ACTIVE);
        // "Sessao atual" reflete o plano que o usuario escolheu como ativo.
        List<WorkoutExercise> currentExercises = workoutPlanRepository
                .findFirstByUserIdAndStatusOrderByCreatedAtDesc(user.userId(), WorkoutPlanStatus.ACTIVE)
                .flatMap(plan -> workoutSessionRepository.findByPlan_IdOrderBySortOrderAsc(plan.getId()).stream().findFirst())
                .map(session -> workoutExerciseRepository.findBySession_IdOrderBySortOrderAsc(session.getId()))
                .orElseGet(List::of);

        return new WorkoutOverviewResponse(
                workoutPlanRepository.countByUserIdAndStatus(user.userId(), WorkoutPlanStatus.ACTIVE),
                weeklyVolumeLabel(user),
                averageDurationLabel(user),
                averageIntensityLabel(programmedSessions),
                programmedSessions.stream().map(this::toBlockResponse).toList(),
                currentExercises.stream().map(this::toExerciseProgressResponse).toList()
        );
    }

    @Transactional
    public WorkoutOverviewResponse generateWithAi(AuthenticatedUser user, GenerateWorkoutRequest request) {
        UserAiCoachContext context = userContextClient.getAiCoachContext(user);
        if (context == null || !context.premiumActive()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "A geração assistida exige um plano ativo.");
        }
        String focus = request == null ? null : request.focus();
        String aiResponse = llmWorkoutClient.generateWorkout(user, context, focus);
        UpdateWorkoutPlanRequest generated = generatedWorkoutParser.parse(aiResponse);

        // O treino gerado pela IA passa a ser o "em uso"; arquiva os demais.
        archiveActivePlans(user.userId(), null);

        WorkoutPlan plan = workoutPlanRepository.save(WorkoutPlan.builder()
                .userId(user.userId())
                .title(generated.title().trim())
                .goal(generated.goal().trim())
                .status(WorkoutPlanStatus.ACTIVE)
                .generationStatus(WorkoutGenerationStatus.AI_GENERATED)
                .rawAiResponse(aiResponse)
                .build());

        for (int index = 0; index < generated.sessions().size(); index++) {
            ManualWorkoutSessionRequest sessionRequest = generated.sessions().get(index);
            WorkoutSession session = createManualSession(plan, user, sessionRequest, index, true);
            createManualExercises(session, sessionRequest.exercises());
        }

        return getOverview(user);
    }

    @Transactional
    public WorkoutOverviewResponse createManualWorkout(AuthenticatedUser user, CreateManualWorkoutRequest request) {
        UserAiCoachContext context = userContextClient.getAiCoachContext(user);
        if ((context == null || !context.premiumActive())
                && workoutPlanRepository.findByUserIdOrderByCreatedAtDesc(user.userId()).size() >= 2) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "O plano gratuito permite até dois treinos.");
        }
        // So entra "em uso" se o usuario ainda nao tem nenhum treino em uso; os demais ficam salvos.
        boolean inUse = workoutPlanRepository.countByUserIdAndStatus(user.userId(), WorkoutPlanStatus.ACTIVE) == 0;

        WorkoutPlan plan = workoutPlanRepository.save(WorkoutPlan.builder()
                .userId(user.userId())
                .title(request.title().trim())
                .goal(request.goal().trim())
                .status(inUse ? WorkoutPlanStatus.ACTIVE : WorkoutPlanStatus.ARCHIVED)
                .generationStatus(WorkoutGenerationStatus.MANUAL)
                .build());

        WorkoutSession session = createManualSession(plan, user, request.session(), 0, inUse);
        createManualExercises(session, request.session().exercises());
        return getOverview(user);
    }

    @Transactional(readOnly = true)
    public List<WorkoutPlanSummaryResponse> listPlans(AuthenticatedUser user) {
        return workoutPlanRepository.findByUserIdOrderByCreatedAtDesc(user.userId()).stream()
                .map(this::toPlanSummary)
                .toList();
    }

    @Transactional(readOnly = true)
    public WorkoutPlanDetailResponse getPlanDetail(AuthenticatedUser user, UUID planId) {
        return toPlanDetail(requireOwnedPlan(user, planId));
    }

    @Transactional
    public WorkoutPlanDetailResponse updatePlan(AuthenticatedUser user, UUID planId, UpdateWorkoutPlanRequest request) {
        WorkoutPlan plan = requireOwnedPlan(user, planId);
        plan.setTitle(request.title().trim());
        plan.setGoal(request.goal().trim());
        workoutPlanRepository.save(plan);

        // Substitui as sessoes/exercicios do plano pelo conteudo enviado.
        boolean inUse = plan.getStatus() == WorkoutPlanStatus.ACTIVE;
        deleteSessionsOfPlan(plan.getId());
        List<ManualWorkoutSessionRequest> sessions = request.sessions();
        for (int index = 0; index < sessions.size(); index++) {
            WorkoutSession session = createManualSession(plan, user, sessions.get(index), index, inUse);
            createManualExercises(session, sessions.get(index).exercises());
        }
        return toPlanDetail(plan);
    }

    @Transactional
    public void deletePlan(AuthenticatedUser user, UUID planId) {
        WorkoutPlan plan = requireOwnedPlan(user, planId);
        deleteSessionsOfPlan(plan.getId());
        workoutPlanRepository.delete(plan);
    }

    @Transactional
    public WorkoutOverviewResponse activatePlan(AuthenticatedUser user, UUID planId) {
        WorkoutPlan plan = requireOwnedPlan(user, planId);

        // Garante exatamente um plano ativo por usuario.
        archiveActivePlans(user.userId(), planId);
        plan.setStatus(WorkoutPlanStatus.ACTIVE);
        workoutPlanRepository.save(plan);

        // A primeira sessao do plano escolhido vira a "sessao atual".
        List<WorkoutSession> sessions = workoutSessionRepository.findByPlan_IdOrderBySortOrderAsc(planId);
        for (int index = 0; index < sessions.size(); index++) {
            WorkoutSession session = sessions.get(index);
            session.setStatus(index == 0 ? WorkoutSessionStatus.IN_PROGRESS : WorkoutSessionStatus.SCHEDULED);
            workoutSessionRepository.save(session);
        }
        return getOverview(user);
    }

    private WorkoutPlan requireOwnedPlan(AuthenticatedUser user, UUID planId) {
        return workoutPlanRepository.findByIdAndUserId(planId, user.userId())
                .orElseThrow(() -> new WorkoutNotFoundException("Treino nao encontrado"));
    }

    /** Arquiva todos os planos em uso do usuario, exceto o informado (mantem 1 ativo por usuario). */
    private void archiveActivePlans(UUID userId, UUID exceptPlanId) {
        for (WorkoutPlan active : workoutPlanRepository.findByUserIdAndStatus(userId, WorkoutPlanStatus.ACTIVE)) {
            if (!active.getId().equals(exceptPlanId)) {
                active.setStatus(WorkoutPlanStatus.ARCHIVED);
                workoutPlanRepository.save(active);
            }
        }
    }

    private void deleteSessionsOfPlan(UUID planId) {
        for (WorkoutSession session : workoutSessionRepository.findByPlan_IdOrderBySortOrderAsc(planId)) {
            workoutExerciseRepository.deleteBySession_Id(session.getId());
        }
        workoutSessionRepository.deleteByPlan_Id(planId);
    }

    private WorkoutPlanSummaryResponse toPlanSummary(WorkoutPlan plan) {
        List<WorkoutSession> sessions = workoutSessionRepository.findByPlan_IdOrderBySortOrderAsc(plan.getId());
        WorkoutSession first = sessions.isEmpty() ? null : sessions.get(0);
        int exerciseCount = sessions.stream()
                .mapToInt(session -> workoutExerciseRepository.findBySession_IdOrderBySortOrderAsc(session.getId()).size())
                .sum();
        return new WorkoutPlanSummaryResponse(
                plan.getId(),
                plan.getTitle(),
                plan.getGoal(),
                originOf(plan.getGenerationStatus()),
                plan.getStatus().name(),
                plan.getStatus() == WorkoutPlanStatus.ACTIVE,
                first == null ? null : first.getScheduledDate(),
                first == null ? null : first.getIntensity(),
                first == null ? null : first.getEstimatedDurationMinutes(),
                sessions.size(),
                exerciseCount,
                plan.getCreatedAt()
        );
    }

    private WorkoutPlanDetailResponse toPlanDetail(WorkoutPlan plan) {
        List<WorkoutSessionDetailResponse> sessions =
                workoutSessionRepository.findByPlan_IdOrderBySortOrderAsc(plan.getId()).stream()
                        .map(this::toSessionDetail)
                        .toList();
        return new WorkoutPlanDetailResponse(
                plan.getId(),
                plan.getTitle(),
                plan.getGoal(),
                originOf(plan.getGenerationStatus()),
                plan.getStatus().name(),
                plan.getStatus() == WorkoutPlanStatus.ACTIVE,
                plan.getCreatedAt(),
                sessions
        );
    }

    private WorkoutSessionDetailResponse toSessionDetail(WorkoutSession session) {
        List<WorkoutExerciseDetailResponse> exercises =
                workoutExerciseRepository.findBySession_IdOrderBySortOrderAsc(session.getId()).stream()
                        .map(this::toExerciseDetail)
                        .toList();
        return new WorkoutSessionDetailResponse(
                session.getId(),
                session.getTitle(),
                session.getScheduledDate(),
                session.getStatus().name(),
                session.getEstimatedDurationMinutes(),
                session.getIntensity(),
                session.getSortOrder(),
                exercises
        );
    }

    private WorkoutExerciseDetailResponse toExerciseDetail(WorkoutExercise exercise) {
        return new WorkoutExerciseDetailResponse(
                exercise.getId(),
                exercise.getName(),
                exercise.getSetsDescription(),
                exercise.getRepsDescription(),
                exercise.getRestSeconds(),
                exercise.getLoadSuggestion(),
                exercise.getExecutionNotes(),
                exercise.getProgressPercent(),
                exercise.getSortOrder()
        );
    }

    private String originOf(WorkoutGenerationStatus status) {
        return status == WorkoutGenerationStatus.MANUAL ? "MANUAL" : "AI";
    }

    private String weeklyVolumeLabel(AuthenticatedUser user) {
        LocalDate today = LocalDate.now();
        LocalDate start = today.with(DayOfWeek.MONDAY);
        LocalDate end = today.with(DayOfWeek.SUNDAY);
        List<WorkoutSession> weekSessions =
                workoutSessionRepository.findByUserIdAndPlan_StatusAndScheduledDateBetweenOrderByScheduledDateAscSortOrderAsc(
                        user.userId(),
                        WorkoutPlanStatus.ACTIVE,
                        start,
                        end
                );

        int exerciseCount = weekSessions.stream()
                .mapToInt(session -> workoutExerciseRepository.findBySession_IdOrderBySortOrderAsc(session.getId()).size())
                .sum();

        return exerciseCount == 0 ? "0 exercicios" : exerciseCount + " exercicios";
    }

    private String averageDurationLabel(AuthenticatedUser user) {
        List<WorkoutSession> sessions = workoutSessionRepository.findTop3ByUserIdAndPlan_StatusOrderByScheduledDateAscSortOrderAsc(user.userId(), WorkoutPlanStatus.ACTIVE);
        double average = sessions.stream()
                .filter(session -> session.getEstimatedDurationMinutes() != null)
                .mapToInt(WorkoutSession::getEstimatedDurationMinutes)
                .average()
                .orElse(0);

        return average == 0 ? "0 min" : Math.round(average) + " min";
    }

    private String averageIntensityLabel(List<WorkoutSession> sessions) {
        return sessions.stream()
                .map(WorkoutSession::getIntensity)
                .filter(StringUtils::hasText)
                .findFirst()
                .orElse("Sem dados");
    }

    private WorkoutBlockResponse toBlockResponse(WorkoutSession session) {
        return new WorkoutBlockResponse(
                session.getId(),
                session.getTitle(),
                "%s min · %s".formatted(
                        session.getEstimatedDurationMinutes() == null ? "--" : session.getEstimatedDurationMinutes(),
                        valueOrFallback(session.getIntensity(), "intensidade a definir")
                ),
                metaForDate(session.getScheduledDate()),
                toneForSession(session)
        );
    }

    private WorkoutExerciseProgressResponse toExerciseProgressResponse(WorkoutExercise exercise) {
        return new WorkoutExerciseProgressResponse(
                exercise.getId(),
                exercise.getName(),
                exercise.getSetsDescription() + " x " + exercise.getRepsDescription(),
                exercise.getProgressPercent()
        );
    }

    private WorkoutSession createManualSession(
            WorkoutPlan plan,
            AuthenticatedUser user,
            ManualWorkoutSessionRequest request,
            int sortOrder,
            boolean inUse
    ) {
        // So o plano em uso tem uma sessao "em andamento"; planos salvos ficam agendados.
        boolean started = inUse && sortOrder == 0 && !request.scheduledDate().isAfter(LocalDate.now());
        return workoutSessionRepository.save(WorkoutSession.builder()
                .plan(plan)
                .userId(user.userId())
                .title(request.title().trim())
                .scheduledDate(request.scheduledDate())
                .status(started ? WorkoutSessionStatus.IN_PROGRESS : WorkoutSessionStatus.SCHEDULED)
                .estimatedDurationMinutes(request.estimatedDurationMinutes())
                .intensity(request.intensity().trim())
                .sortOrder(sortOrder)
                .build());
    }

    private void createManualExercises(WorkoutSession session, List<ManualWorkoutExerciseRequest> exercises) {
        for (int index = 0; index < exercises.size(); index++) {
            ManualWorkoutExerciseRequest exercise = exercises.get(index);
            workoutExerciseRepository.save(WorkoutExercise.builder()
                    .session(session)
                    .name(exercise.name().trim())
                    .setsDescription(exercise.setsDescription().trim())
                    .repsDescription(exercise.repsDescription().trim())
                    .restSeconds(exercise.restSeconds())
                    .loadSuggestion(trimToNull(exercise.loadSuggestion()))
                    .executionNotes(trimToNull(exercise.executionNotes()))
                    .progressPercent(0)
                    .sortOrder(index)
                    .build());
        }
    }

    private String metaForDate(LocalDate date) {
        LocalDate today = LocalDate.now();
        if (date.isEqual(today)) {
            return "Hoje";
        }
        if (date.isEqual(today.plusDays(1))) {
            return "Amanha";
        }
        return SHORT_DATE_FORMATTER.format(date);
    }

    private String toneForSession(WorkoutSession session) {
        if (session.getStatus() == WorkoutSessionStatus.IN_PROGRESS) {
            return "primary";
        }
        if ("Baixa".equalsIgnoreCase(session.getIntensity())) {
            return "warning";
        }
        return "success";
    }

    private String valueOrFallback(String value, String fallback) {
        return StringUtils.hasText(value) ? value : fallback;
    }

    private String trimToNull(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }

}

package com.gym.training.workout.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.gym.training.workout.controller.request.CreateManualWorkoutRequest;
import com.gym.training.workout.controller.request.ManualWorkoutExerciseRequest;
import com.gym.training.workout.controller.request.ManualWorkoutSessionRequest;
import com.gym.training.workout.controller.request.UpdateWorkoutPlanRequest;
import com.gym.training.workout.domain.WorkoutGenerationStatus;
import com.gym.training.workout.domain.WorkoutPlan;
import com.gym.training.workout.domain.WorkoutPlanStatus;
import com.gym.training.workout.domain.WorkoutSession;
import com.gym.training.workout.domain.WorkoutSessionStatus;
import com.gym.training.workout.exception.WorkoutNotFoundException;
import com.gym.training.workout.repository.WorkoutExerciseRepository;
import com.gym.training.workout.repository.WorkoutPlanRepository;
import com.gym.training.workout.repository.WorkoutSessionRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class WorkoutServiceTest {

    @Mock
    private WorkoutPlanRepository workoutPlanRepository;

    @Mock
    private WorkoutSessionRepository workoutSessionRepository;

    @Mock
    private WorkoutExerciseRepository workoutExerciseRepository;

    @Mock
    private UserContextClient userContextClient;

    @Mock
    private LlmWorkoutClient llmWorkoutClient;

    @InjectMocks
    private WorkoutService workoutService;

    private final UUID userId = UUID.randomUUID();
    private final AuthenticatedUser user = new AuthenticatedUser(userId, "aluno@fitai.com", "Aluno");

    private WorkoutPlan plan(UUID id, WorkoutPlanStatus status, WorkoutGenerationStatus generation) {
        return WorkoutPlan.builder()
                .id(id)
                .userId(userId)
                .title("Plano")
                .goal("HYPERTROPHY")
                .status(status)
                .generationStatus(generation)
                .build();
    }

    private WorkoutSession session(UUID id, WorkoutPlan plan, int sortOrder) {
        return WorkoutSession.builder()
                .id(id)
                .plan(plan)
                .userId(userId)
                .title("Sessao " + sortOrder)
                .scheduledDate(LocalDate.now())
                .status(WorkoutSessionStatus.SCHEDULED)
                .estimatedDurationMinutes(50)
                .intensity("Moderada")
                .sortOrder(sortOrder)
                .build();
    }

    @Test
    void getOverviewContaTreinosAtivosDoUsuario() {
        when(workoutPlanRepository.countByUserIdAndStatus(userId, WorkoutPlanStatus.ACTIVE)).thenReturn(2L);
        when(workoutSessionRepository.findTop3ByUserIdOrderByScheduledDateAscSortOrderAsc(userId)).thenReturn(List.of());
        when(workoutPlanRepository.findFirstByUserIdAndStatusOrderByCreatedAtDesc(userId, WorkoutPlanStatus.ACTIVE))
                .thenReturn(Optional.empty());
        when(workoutSessionRepository.findByUserIdAndScheduledDateBetweenOrderByScheduledDateAscSortOrderAsc(
                eq(userId),
                any(),
                any()
        )).thenReturn(List.of());

        var overview = workoutService.getOverview(user);

        assertEquals(2, overview.activeSessions());
        verify(workoutPlanRepository).countByUserIdAndStatus(userId, WorkoutPlanStatus.ACTIVE);
    }

    @Test
    void getPlanDetailDeOutroUsuarioRetorna404() {
        UUID planId = UUID.randomUUID();
        when(workoutPlanRepository.findByIdAndUserId(planId, userId)).thenReturn(Optional.empty());

        assertThrows(WorkoutNotFoundException.class, () -> workoutService.getPlanDetail(user, planId));
    }

    @Test
    void activatePlanDeixaApenasUmAtivoEPrimeiraSessaoEmAndamento() {
        UUID chosenId = UUID.randomUUID();
        UUID otherId = UUID.randomUUID();
        WorkoutPlan chosen = plan(chosenId, WorkoutPlanStatus.ARCHIVED, WorkoutGenerationStatus.MANUAL);
        WorkoutPlan other = plan(otherId, WorkoutPlanStatus.ACTIVE, WorkoutGenerationStatus.AI_GENERATED);
        WorkoutSession s0 = session(UUID.randomUUID(), chosen, 0);
        WorkoutSession s1 = session(UUID.randomUUID(), chosen, 1);

        when(workoutPlanRepository.findByIdAndUserId(chosenId, userId)).thenReturn(Optional.of(chosen));
        when(workoutPlanRepository.findByUserIdAndStatus(userId, WorkoutPlanStatus.ACTIVE)).thenReturn(List.of(other));
        when(workoutSessionRepository.findByPlan_IdOrderBySortOrderAsc(chosenId)).thenReturn(List.of(s0, s1));
        when(workoutPlanRepository.findFirstByUserIdAndStatusOrderByCreatedAtDesc(userId, WorkoutPlanStatus.ACTIVE))
                .thenReturn(Optional.of(chosen));
        when(workoutSessionRepository.findTop3ByUserIdOrderByScheduledDateAscSortOrderAsc(userId)).thenReturn(List.of());
        when(workoutExerciseRepository.findBySession_IdOrderBySortOrderAsc(any())).thenReturn(List.of());

        workoutService.activatePlan(user, chosenId);

        assertEquals(WorkoutPlanStatus.ACTIVE, chosen.getStatus());
        assertEquals(WorkoutPlanStatus.ARCHIVED, other.getStatus());
        assertEquals(WorkoutSessionStatus.IN_PROGRESS, s0.getStatus());
        assertEquals(WorkoutSessionStatus.SCHEDULED, s1.getStatus());
    }

    @Test
    void deletePlanRemoveExerciciosSessoesEPlanoEmCascata() {
        UUID planId = UUID.randomUUID();
        WorkoutPlan target = plan(planId, WorkoutPlanStatus.ACTIVE, WorkoutGenerationStatus.MANUAL);
        WorkoutSession s0 = session(UUID.randomUUID(), target, 0);

        when(workoutPlanRepository.findByIdAndUserId(planId, userId)).thenReturn(Optional.of(target));
        when(workoutSessionRepository.findByPlan_IdOrderBySortOrderAsc(planId)).thenReturn(List.of(s0));

        workoutService.deletePlan(user, planId);

        verify(workoutExerciseRepository).deleteBySession_Id(s0.getId());
        verify(workoutSessionRepository).deleteByPlan_Id(planId);
        verify(workoutPlanRepository).delete(target);
    }

    @Test
    void updatePlanSubstituiTituloMetaESessoes() {
        UUID planId = UUID.randomUUID();
        WorkoutPlan target = plan(planId, WorkoutPlanStatus.ACTIVE, WorkoutGenerationStatus.AI_GENERATED);
        WorkoutSession oldSession = session(UUID.randomUUID(), target, 0);
        WorkoutSession newSession = session(UUID.randomUUID(), target, 0);

        when(workoutPlanRepository.findByIdAndUserId(planId, userId)).thenReturn(Optional.of(target));
        when(workoutSessionRepository.findByPlan_IdOrderBySortOrderAsc(planId))
                .thenReturn(List.of(oldSession), List.of(newSession));
        when(workoutSessionRepository.save(any())).thenReturn(newSession);
        when(workoutExerciseRepository.findBySession_IdOrderBySortOrderAsc(eq(newSession.getId()))).thenReturn(List.of());

        UpdateWorkoutPlanRequest request = new UpdateWorkoutPlanRequest(
                "Novo titulo",
                "STRENGTH",
                List.of(new ManualWorkoutSessionRequest(
                        "Treino A",
                        LocalDate.now(),
                        50,
                        "Alta",
                        List.of(new ManualWorkoutExerciseRequest("Supino", "4", "8", 90, null, null))
                ))
        );

        workoutService.updatePlan(user, planId, request);

        assertEquals("Novo titulo", target.getTitle());
        assertEquals("STRENGTH", target.getGoal());
        verify(workoutExerciseRepository).deleteBySession_Id(oldSession.getId());
        verify(workoutSessionRepository).deleteByPlan_Id(planId);
        verify(workoutExerciseRepository).save(any());
    }

    @Test
    void createManualPrimeiroTreinoFicaEmUso() {
        when(workoutPlanRepository.countByUserIdAndStatus(userId, WorkoutPlanStatus.ACTIVE)).thenReturn(0L);
        when(workoutPlanRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(workoutSessionRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        stubEmptyOverview();

        workoutService.createManualWorkout(user, manualRequest());

        ArgumentCaptor<WorkoutPlan> captor = ArgumentCaptor.forClass(WorkoutPlan.class);
        verify(workoutPlanRepository).save(captor.capture());
        assertEquals(WorkoutPlanStatus.ACTIVE, captor.getValue().getStatus());
    }

    @Test
    void createManualComTreinoEmUsoFicaSalvo() {
        when(workoutPlanRepository.countByUserIdAndStatus(userId, WorkoutPlanStatus.ACTIVE)).thenReturn(1L);
        when(workoutPlanRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(workoutSessionRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        stubEmptyOverview();

        workoutService.createManualWorkout(user, manualRequest());

        ArgumentCaptor<WorkoutPlan> captor = ArgumentCaptor.forClass(WorkoutPlan.class);
        verify(workoutPlanRepository).save(captor.capture());
        assertEquals(WorkoutPlanStatus.ARCHIVED, captor.getValue().getStatus());
    }

    @Test
    void generateWithAiArquivaOutrosEFicaEmUso() {
        WorkoutPlan existing = plan(UUID.randomUUID(), WorkoutPlanStatus.ACTIVE, WorkoutGenerationStatus.MANUAL);
        when(userContextClient.getAiCoachContext(user)).thenReturn(UserAiCoachContext.empty(user));
        when(llmWorkoutClient.generateWorkout(eq(user), any(), any())).thenReturn("");
        when(workoutPlanRepository.findByUserIdAndStatus(userId, WorkoutPlanStatus.ACTIVE)).thenReturn(List.of(existing));
        when(workoutPlanRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(workoutSessionRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        stubEmptyOverview();

        workoutService.generateWithAi(user, null);

        assertEquals(WorkoutPlanStatus.ARCHIVED, existing.getStatus());
        ArgumentCaptor<WorkoutPlan> captor = ArgumentCaptor.forClass(WorkoutPlan.class);
        verify(workoutPlanRepository, atLeastOnce()).save(captor.capture());
        boolean novoPlanoEmUso = captor.getAllValues().stream()
                .anyMatch(saved -> saved != existing && saved.getStatus() == WorkoutPlanStatus.ACTIVE);
        assertTrue(novoPlanoEmUso);
    }

    private void stubEmptyOverview() {
        when(workoutPlanRepository.findFirstByUserIdAndStatusOrderByCreatedAtDesc(userId, WorkoutPlanStatus.ACTIVE))
                .thenReturn(Optional.empty());
        when(workoutSessionRepository.findTop3ByUserIdOrderByScheduledDateAscSortOrderAsc(userId)).thenReturn(List.of());
        when(workoutSessionRepository.findByUserIdAndScheduledDateBetweenOrderByScheduledDateAscSortOrderAsc(
                eq(userId),
                any(),
                any()
        )).thenReturn(List.of());
    }

    private CreateManualWorkoutRequest manualRequest() {
        return new CreateManualWorkoutRequest(
                "Meu treino",
                "HYPERTROPHY",
                new ManualWorkoutSessionRequest(
                        "Treino A",
                        LocalDate.now(),
                        50,
                        "Alta",
                        List.of(new ManualWorkoutExerciseRequest("Supino", "4", "8", 90, null, null))
                )
        );
    }
}

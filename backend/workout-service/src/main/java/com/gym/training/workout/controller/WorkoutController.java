package com.gym.training.workout.controller;

import com.gym.training.workout.controller.request.CreateManualWorkoutRequest;
import com.gym.training.workout.controller.request.GenerateWorkoutRequest;
import com.gym.training.workout.controller.request.UpdateWorkoutPlanRequest;
import com.gym.training.workout.controller.response.WorkoutOverviewResponse;
import com.gym.training.workout.controller.response.WorkoutPlanDetailResponse;
import com.gym.training.workout.controller.response.WorkoutPlanSummaryResponse;
import com.gym.training.workout.service.AuthenticatedUser;
import com.gym.training.workout.service.CurrentUserResolver;
import com.gym.training.workout.service.WorkoutService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/workouts/me")
@RequiredArgsConstructor
public class WorkoutController {

    private static final String USER_ID_HEADER = "X-User-Id";
    private static final String USER_EMAIL_HEADER = "X-User-Email";
    private static final String USER_FULL_NAME_HEADER = "X-User-Full-Name";

    private final CurrentUserResolver currentUserResolver;
    private final WorkoutService workoutService;

    @GetMapping("/overview")
    public WorkoutOverviewResponse getOverview(
            @RequestHeader(USER_ID_HEADER) String userId,
            @RequestHeader(USER_EMAIL_HEADER) String email,
            @RequestHeader(value = USER_FULL_NAME_HEADER, required = false) String fullName
    ) {
        return workoutService.getOverview(resolveUser(userId, email, fullName));
    }

    @PostMapping("/generate-with-ai")
    public WorkoutOverviewResponse generateWithAi(
            @RequestHeader(USER_ID_HEADER) String userId,
            @RequestHeader(USER_EMAIL_HEADER) String email,
            @RequestHeader(value = USER_FULL_NAME_HEADER, required = false) String fullName,
            @Valid @RequestBody(required = false) GenerateWorkoutRequest request
    ) {
        return workoutService.generateWithAi(resolveUser(userId, email, fullName), request);
    }

    @PostMapping("/manual")
    public WorkoutOverviewResponse createManualWorkout(
            @RequestHeader(USER_ID_HEADER) String userId,
            @RequestHeader(USER_EMAIL_HEADER) String email,
            @RequestHeader(value = USER_FULL_NAME_HEADER, required = false) String fullName,
            @Valid @RequestBody CreateManualWorkoutRequest request
    ) {
        return workoutService.createManualWorkout(resolveUser(userId, email, fullName), request);
    }

    @GetMapping("/plans")
    public List<WorkoutPlanSummaryResponse> listPlans(
            @RequestHeader(USER_ID_HEADER) String userId,
            @RequestHeader(USER_EMAIL_HEADER) String email,
            @RequestHeader(value = USER_FULL_NAME_HEADER, required = false) String fullName
    ) {
        return workoutService.listPlans(resolveUser(userId, email, fullName));
    }

    @GetMapping("/plans/{planId}")
    public WorkoutPlanDetailResponse getPlan(
            @RequestHeader(USER_ID_HEADER) String userId,
            @RequestHeader(USER_EMAIL_HEADER) String email,
            @RequestHeader(value = USER_FULL_NAME_HEADER, required = false) String fullName,
            @PathVariable UUID planId
    ) {
        return workoutService.getPlanDetail(resolveUser(userId, email, fullName), planId);
    }

    @PutMapping("/plans/{planId}")
    public WorkoutPlanDetailResponse updatePlan(
            @RequestHeader(USER_ID_HEADER) String userId,
            @RequestHeader(USER_EMAIL_HEADER) String email,
            @RequestHeader(value = USER_FULL_NAME_HEADER, required = false) String fullName,
            @PathVariable UUID planId,
            @Valid @RequestBody UpdateWorkoutPlanRequest request
    ) {
        return workoutService.updatePlan(resolveUser(userId, email, fullName), planId, request);
    }

    @DeleteMapping("/plans/{planId}")
    public ResponseEntity<Void> deletePlan(
            @RequestHeader(USER_ID_HEADER) String userId,
            @RequestHeader(USER_EMAIL_HEADER) String email,
            @RequestHeader(value = USER_FULL_NAME_HEADER, required = false) String fullName,
            @PathVariable UUID planId
    ) {
        workoutService.deletePlan(resolveUser(userId, email, fullName), planId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/plans/{planId}/activate")
    public WorkoutOverviewResponse activatePlan(
            @RequestHeader(USER_ID_HEADER) String userId,
            @RequestHeader(USER_EMAIL_HEADER) String email,
            @RequestHeader(value = USER_FULL_NAME_HEADER, required = false) String fullName,
            @PathVariable UUID planId
    ) {
        return workoutService.activatePlan(resolveUser(userId, email, fullName), planId);
    }

    private AuthenticatedUser resolveUser(String userId, String email, String fullName) {
        return currentUserResolver.resolve(userId, email, fullName);
    }
}

package com.gym.training.workout.controller;

import com.gym.training.workout.controller.request.CreateManualWorkoutRequest;
import com.gym.training.workout.controller.request.GenerateWorkoutRequest;
import com.gym.training.workout.controller.response.WorkoutOverviewResponse;
import com.gym.training.workout.service.AuthenticatedUser;
import com.gym.training.workout.service.CurrentUserResolver;
import com.gym.training.workout.service.WorkoutService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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

    private AuthenticatedUser resolveUser(String userId, String email, String fullName) {
        return currentUserResolver.resolve(userId, email, fullName);
    }
}

package com.gym.training.workout.controller.response;

import java.util.List;

public record WorkoutOverviewResponse(
        long activeSessions,
        String weeklyVolumeLabel,
        String averageDurationLabel,
        String averageIntensityLabel,
        List<WorkoutBlockResponse> programmedBlocks,
        List<WorkoutExerciseProgressResponse> currentSession
) {
}

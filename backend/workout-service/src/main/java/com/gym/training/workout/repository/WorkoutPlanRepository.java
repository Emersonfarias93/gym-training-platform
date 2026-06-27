package com.gym.training.workout.repository;

import com.gym.training.workout.domain.WorkoutPlan;
import com.gym.training.workout.domain.WorkoutPlanStatus;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkoutPlanRepository extends JpaRepository<WorkoutPlan, UUID> {

    Optional<WorkoutPlan> findFirstByUserIdAndStatusOrderByCreatedAtDesc(UUID userId, WorkoutPlanStatus status);

    long countByUserIdAndStatus(UUID userId, WorkoutPlanStatus status);

    List<WorkoutPlan> findTop3ByUserIdOrderByCreatedAtDesc(UUID userId);

    List<WorkoutPlan> findByUserIdOrderByCreatedAtDesc(UUID userId);

    Optional<WorkoutPlan> findByIdAndUserId(UUID id, UUID userId);

    List<WorkoutPlan> findByUserIdAndStatus(UUID userId, WorkoutPlanStatus status);
}

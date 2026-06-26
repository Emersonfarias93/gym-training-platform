package com.gym.training.workout.repository;

import com.gym.training.workout.domain.WorkoutSession;
import com.gym.training.workout.domain.WorkoutSessionStatus;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkoutSessionRepository extends JpaRepository<WorkoutSession, UUID> {

    long countByUserIdAndStatusIn(UUID userId, Collection<WorkoutSessionStatus> statuses);

    List<WorkoutSession> findTop3ByUserIdOrderByScheduledDateAscSortOrderAsc(UUID userId);

    Optional<WorkoutSession> findFirstByUserIdAndStatusInOrderByScheduledDateAscSortOrderAsc(
            UUID userId,
            Collection<WorkoutSessionStatus> statuses
    );

    List<WorkoutSession> findByUserIdAndScheduledDateBetweenOrderByScheduledDateAscSortOrderAsc(
            UUID userId,
            LocalDate start,
            LocalDate end
    );
}

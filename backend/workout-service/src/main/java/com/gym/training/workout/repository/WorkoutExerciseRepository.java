package com.gym.training.workout.repository;

import com.gym.training.workout.domain.WorkoutExercise;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkoutExerciseRepository extends JpaRepository<WorkoutExercise, UUID> {

    List<WorkoutExercise> findBySession_IdOrderBySortOrderAsc(UUID sessionId);

    void deleteBySession_Id(UUID sessionId);
}

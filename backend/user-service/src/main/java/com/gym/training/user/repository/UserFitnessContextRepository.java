package com.gym.training.user.repository;

import com.gym.training.user.domain.UserFitnessContext;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserFitnessContextRepository extends JpaRepository<UserFitnessContext, UUID> {

    Optional<UserFitnessContext> findByUserProfileAuthUserId(UUID authUserId);
}

package com.gym.training.user.repository;

import com.gym.training.user.domain.UserPreferences;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserPreferencesRepository extends JpaRepository<UserPreferences, UUID> {

    Optional<UserPreferences> findByUserProfileAuthUserId(UUID authUserId);
}

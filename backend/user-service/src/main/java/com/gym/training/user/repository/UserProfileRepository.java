package com.gym.training.user.repository;

import com.gym.training.user.domain.UserProfile;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserProfileRepository extends JpaRepository<UserProfile, UUID> {

    Optional<UserProfile> findByAuthUserId(UUID authUserId);

    boolean existsByEmailIgnoreCase(String email);
}

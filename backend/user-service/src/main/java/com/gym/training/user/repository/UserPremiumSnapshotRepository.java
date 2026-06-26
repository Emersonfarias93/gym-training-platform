package com.gym.training.user.repository;

import com.gym.training.user.domain.UserPremiumSnapshot;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserPremiumSnapshotRepository extends JpaRepository<UserPremiumSnapshot, UUID> {

    Optional<UserPremiumSnapshot> findByUserProfileAuthUserId(UUID authUserId);
}

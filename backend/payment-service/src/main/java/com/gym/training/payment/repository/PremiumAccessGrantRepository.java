package com.gym.training.payment.repository;

import com.gym.training.payment.domain.PremiumAccessGrant;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PremiumAccessGrantRepository extends JpaRepository<PremiumAccessGrant, UUID> {

    Optional<PremiumAccessGrant> findByAuthUserId(UUID authUserId);
}

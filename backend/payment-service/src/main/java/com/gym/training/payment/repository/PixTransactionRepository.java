package com.gym.training.payment.repository;

import com.gym.training.payment.domain.PixTransaction;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PixTransactionRepository extends JpaRepository<PixTransaction, UUID> {

    Optional<PixTransaction> findByConfrapixUuid(String confrapixUuid);

    Optional<PixTransaction> findTopByAuthUserIdAndProcessedTrueOrderByPaidAtDescCreatedAtDesc(UUID authUserId);
}

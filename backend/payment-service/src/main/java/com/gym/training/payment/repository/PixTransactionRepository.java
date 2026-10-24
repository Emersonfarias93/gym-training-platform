package com.gym.training.payment.repository;

import com.gym.training.payment.domain.PixTransaction;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import jakarta.persistence.LockModeType;

public interface PixTransactionRepository extends JpaRepository<PixTransaction, UUID> {
    boolean existsByConfrapixUuidAndAuthUserId(String confrapixUuid, UUID authUserId);

    boolean existsByConfrapixTransactionIdAndAuthUserId(String confrapixTransactionId, UUID authUserId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<PixTransaction> findByConfrapixUuid(String confrapixUuid);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<PixTransaction> findByConfrapixTransactionId(String confrapixTransactionId);

    Optional<PixTransaction> findTopByAuthUserIdAndProcessedTrueOrderByPaidAtDescCreatedAtDesc(UUID authUserId);
}

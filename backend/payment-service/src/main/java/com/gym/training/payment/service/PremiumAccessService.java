package com.gym.training.payment.service;

import com.gym.training.payment.controller.response.PaymentAccessStatusResponse;
import com.gym.training.payment.domain.PixTransaction;
import com.gym.training.payment.domain.PremiumAccessGrant;
import com.gym.training.payment.domain.PremiumAccessStatus;
import com.gym.training.payment.repository.PixTransactionRepository;
import com.gym.training.payment.repository.PremiumAccessGrantRepository;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PremiumAccessService {

    private final PremiumAccessGrantRepository premiumAccessGrantRepository;
    private final PixTransactionRepository pixTransactionRepository;

    public PremiumAccessService(
            PremiumAccessGrantRepository premiumAccessGrantRepository,
            PixTransactionRepository pixTransactionRepository
    ) {
        this.premiumAccessGrantRepository = premiumAccessGrantRepository;
        this.pixTransactionRepository = pixTransactionRepository;
    }

    @Transactional
    public PremiumAccessGrant grantMonthlyAccess(PixTransaction transaction) {
        PremiumAccessGrant grant = premiumAccessGrantRepository.findByAuthUserId(transaction.getAuthUserId())
                .orElseGet(() -> newGrant(transaction.getAuthUserId()));

        if (transaction.getConfrapixUuid().equals(grant.getLastPaymentTransactionUuid())) {
            return refreshExpirationState(grant);
        }

        Instant now = Instant.now();
        Instant base = grant.getExpiresAt() != null && grant.getExpiresAt().isAfter(now)
                ? grant.getExpiresAt()
                : now;

        grant.setPlanName(transaction.getPlanName());
        grant.setStatus(PremiumAccessStatus.ACTIVE);
        grant.setLastPaymentTransactionUuid(transaction.getConfrapixUuid());
        grant.setStartsAt(now);
        grant.setExpiresAt(plusOneMonth(base));
        grant.setLastSyncedAt(now);
        return premiumAccessGrantRepository.save(grant);
    }

    @Transactional
    public PaymentAccessStatusResponse getAccessStatus(UUID authUserId) {
        PremiumAccessGrant grant = premiumAccessGrantRepository.findByAuthUserId(authUserId)
                .or(() -> restoreFromProcessedPayment(authUserId))
                .orElse(null);

        if (grant == null) {
            return emptyStatus(authUserId);
        }

        grant = refreshExpirationState(grant);
        return toResponse(grant);
    }

    private Optional<PremiumAccessGrant> restoreFromProcessedPayment(UUID authUserId) {
        return pixTransactionRepository.findTopByAuthUserIdAndProcessedTrueOrderByPaidAtDescCreatedAtDesc(authUserId)
                .map(this::restoreGrantFromTransaction);
    }

    private PremiumAccessGrant restoreGrantFromTransaction(PixTransaction transaction) {
        PremiumAccessGrant grant = newGrant(transaction.getAuthUserId());
        Instant paidAt = transaction.getPaidAt() != null ? transaction.getPaidAt() : transaction.getCreatedAt();
        Instant expiresAt = plusOneMonth(paidAt);
        Instant now = Instant.now();

        grant.setPlanName(transaction.getPlanName());
        grant.setStatus(expiresAt.isAfter(now) ? PremiumAccessStatus.ACTIVE : PremiumAccessStatus.EXPIRED);
        grant.setLastPaymentTransactionUuid(transaction.getConfrapixUuid());
        grant.setStartsAt(paidAt);
        grant.setExpiresAt(expiresAt);
        grant.setLastSyncedAt(now);
        return premiumAccessGrantRepository.save(grant);
    }

    private PremiumAccessGrant refreshExpirationState(PremiumAccessGrant grant) {
        if (grant.getStatus() == PremiumAccessStatus.ACTIVE
                && grant.getExpiresAt() != null
                && !grant.getExpiresAt().isAfter(Instant.now())) {
            grant.setStatus(PremiumAccessStatus.EXPIRED);
            grant.setLastSyncedAt(Instant.now());
            return premiumAccessGrantRepository.save(grant);
        }
        return grant;
    }

    private PremiumAccessGrant newGrant(UUID authUserId) {
        PremiumAccessGrant grant = new PremiumAccessGrant();
        grant.setId(UUID.randomUUID());
        grant.setAuthUserId(authUserId);
        grant.setStatus(PremiumAccessStatus.NONE);
        return grant;
    }

    private PaymentAccessStatusResponse emptyStatus(UUID authUserId) {
        return new PaymentAccessStatusResponse(
                authUserId,
                false,
                null,
                PremiumAccessStatus.NONE,
                null,
                null,
                null
        );
    }

    private PaymentAccessStatusResponse toResponse(PremiumAccessGrant grant) {
        boolean active = grant.getStatus() == PremiumAccessStatus.ACTIVE
                && grant.getExpiresAt() != null
                && grant.getExpiresAt().isAfter(Instant.now());

        return new PaymentAccessStatusResponse(
                grant.getAuthUserId(),
                active,
                grant.getPlanName(),
                grant.getStatus(),
                grant.getExpiresAt(),
                grant.getLastPaymentTransactionUuid(),
                grant.getLastSyncedAt()
        );
    }

    private Instant plusOneMonth(Instant base) {
        return ZonedDateTime.ofInstant(base, ZoneOffset.UTC).plusMonths(1).toInstant();
    }
}

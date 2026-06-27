package com.gym.training.user.service;

import com.gym.training.user.controller.response.UserPremiumStatusResponse;
import com.gym.training.user.domain.PremiumStatus;
import com.gym.training.user.domain.UserPremiumSnapshot;
import com.gym.training.user.domain.UserProfile;
import com.gym.training.user.repository.UserPremiumSnapshotRepository;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.Objects;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserPremiumService {

    private final UserProfileService userProfileService;
    private final UserPremiumSnapshotRepository userPremiumSnapshotRepository;
    private final PaymentAccessClient paymentAccessClient;

    @Transactional
    public UserPremiumStatusResponse getPremiumStatus(AuthenticatedUser authenticatedUser) {
        return toResponse(getOrCreatePremiumSnapshot(authenticatedUser));
    }

    @Transactional
    public UserPremiumSnapshot getOrCreatePremiumSnapshot(AuthenticatedUser authenticatedUser) {
        UserPremiumSnapshot snapshot = getOrCreatePremiumSnapshotWithoutSync(authenticatedUser);
        return syncWithPaymentAccess(authenticatedUser, snapshot);
    }

    /**
     * Ativa o premium do usuario a partir da confirmacao de pagamento (evento Kafka).
     * Idempotente: reprocessar o mesmo pagamento nao altera um snapshot ja ativo.
     */
    @Transactional
    public void activatePremium(UUID userId, String email, String fullName, String planName) {
        UserPremiumSnapshot snapshot = userPremiumSnapshotRepository
                .findByUserProfileAuthUserId(userId)
                .orElse(null);

        if (snapshot == null) {
            if (email == null || fullName == null) {
                log.warn("Ativacao premium sem snapshot e sem dados de perfil. userId={}", userId);
                return;
            }
            snapshot = getOrCreatePremiumSnapshotWithoutSync(new AuthenticatedUser(userId, email, fullName));
        }

        if (snapshot.isPremiumActive() && snapshot.getStatus() == PremiumStatus.ACTIVE) {
            log.info("Premium ja ativo para o usuario {}, ignorando evento.", userId);
            return;
        }

        snapshot.setPremiumActive(true);
        snapshot.setStatus(PremiumStatus.ACTIVE);
        if (planName != null) {
            snapshot.setPlanName(planName);
        }
        snapshot.setCurrentPeriodEnd(ZonedDateTime.now(ZoneOffset.UTC).plusMonths(1).toInstant());
        snapshot.setLastSyncedAt(Instant.now());
        userPremiumSnapshotRepository.save(snapshot);
        log.info("Premium ativado para o usuario {}.", userId);
    }

    private UserPremiumSnapshot getOrCreatePremiumSnapshotWithoutSync(AuthenticatedUser authenticatedUser) {
        return userPremiumSnapshotRepository.findByUserProfileAuthUserId(authenticatedUser.userId())
                .orElseGet(() -> createPremiumSnapshot(authenticatedUser));
    }

    private UserPremiumSnapshot syncWithPaymentAccess(AuthenticatedUser authenticatedUser, UserPremiumSnapshot snapshot) {
        var access = paymentAccessClient.getAccessStatus(authenticatedUser);
        if (access == null) {
            return snapshot;
        }
        return access
                .map(accessStatus -> applyPaymentAccess(snapshot, accessStatus))
                .orElse(snapshot);
    }

    private UserPremiumSnapshot applyPaymentAccess(UserPremiumSnapshot snapshot, PaymentAccessStatusResponse access) {
        if (access.userId() == null || !access.userId().equals(snapshot.getUserProfile().getAuthUserId())) {
            return snapshot;
        }

        PremiumStatus status = mapPremiumStatus(access.status(), access.premiumActive());
        boolean active = access.premiumActive() && status == PremiumStatus.ACTIVE;
        boolean changed = false;

        if (snapshot.isPremiumActive() != active) {
            snapshot.setPremiumActive(active);
            changed = true;
        }
        if (snapshot.getStatus() != status) {
            snapshot.setStatus(status);
            changed = true;
        }
        if (access.planName() != null && !Objects.equals(snapshot.getPlanName(), access.planName())) {
            snapshot.setPlanName(access.planName());
            changed = true;
        }
        if (!Objects.equals(snapshot.getCurrentPeriodEnd(), access.currentPeriodEnd())) {
            snapshot.setCurrentPeriodEnd(access.currentPeriodEnd());
            changed = true;
        }
        if (access.lastSyncedAt() != null && !Objects.equals(snapshot.getLastSyncedAt(), access.lastSyncedAt())) {
            snapshot.setLastSyncedAt(access.lastSyncedAt());
            changed = true;
        }

        return changed ? userPremiumSnapshotRepository.save(snapshot) : snapshot;
    }

    private PremiumStatus mapPremiumStatus(String status, boolean premiumActive) {
        if (status != null) {
            try {
                return PremiumStatus.valueOf(status);
            } catch (IllegalArgumentException exception) {
                log.warn("Status premium desconhecido recebido do payment-service: {}", status);
            }
        }
        return premiumActive ? PremiumStatus.ACTIVE : PremiumStatus.NONE;
    }

    private UserPremiumSnapshot createPremiumSnapshot(AuthenticatedUser authenticatedUser) {
        UserProfile profile = userProfileService.getOrCreateProfile(authenticatedUser);
        UserPremiumSnapshot snapshot = UserPremiumSnapshot.builder()
                .id(UUID.randomUUID())
                .userProfile(profile)
                .build();

        return userPremiumSnapshotRepository.save(snapshot);
    }

    private UserPremiumStatusResponse toResponse(UserPremiumSnapshot snapshot) {
        return new UserPremiumStatusResponse(
                snapshot.getUserProfile().getAuthUserId(),
                snapshot.isPremiumActive(),
                snapshot.getPlanName(),
                snapshot.getStatus(),
                snapshot.getCurrentPeriodEnd(),
                snapshot.getLastSyncedAt()
        );
    }
}

package com.gym.training.user.service;

import com.gym.training.user.controller.response.UserPremiumStatusResponse;
import com.gym.training.user.domain.PremiumStatus;
import com.gym.training.user.domain.UserPremiumSnapshot;
import com.gym.training.user.domain.UserProfile;
import com.gym.training.user.repository.UserPremiumSnapshotRepository;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
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

    @Transactional
    public UserPremiumStatusResponse getPremiumStatus(AuthenticatedUser authenticatedUser) {
        return toResponse(getOrCreatePremiumSnapshot(authenticatedUser));
    }

    @Transactional
    public UserPremiumSnapshot getOrCreatePremiumSnapshot(AuthenticatedUser authenticatedUser) {
        return userPremiumSnapshotRepository.findByUserProfileAuthUserId(authenticatedUser.userId())
                .orElseGet(() -> createPremiumSnapshot(authenticatedUser));
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
            snapshot = getOrCreatePremiumSnapshot(new AuthenticatedUser(userId, email, fullName));
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

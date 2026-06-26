package com.gym.training.user.service;

import com.gym.training.user.controller.response.UserPremiumStatusResponse;
import com.gym.training.user.domain.UserPremiumSnapshot;
import com.gym.training.user.domain.UserProfile;
import com.gym.training.user.repository.UserPremiumSnapshotRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

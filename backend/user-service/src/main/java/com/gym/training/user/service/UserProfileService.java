package com.gym.training.user.service;

import com.gym.training.user.controller.request.UpdateUserProfileRequest;
import com.gym.training.user.controller.response.UserProfileResponse;
import com.gym.training.user.domain.UserProfile;
import com.gym.training.user.exception.DuplicateUserProfileException;
import com.gym.training.user.repository.UserProfileRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;

    @Transactional
    public UserProfileResponse getProfile(AuthenticatedUser authenticatedUser) {
        return toResponse(getOrCreateProfile(authenticatedUser));
    }

    @Transactional
    public UserProfileResponse updateProfile(AuthenticatedUser authenticatedUser, UpdateUserProfileRequest request) {
        UserProfile profile = getOrCreateProfile(authenticatedUser);

        if (StringUtils.hasText(request.fullName())) {
            profile.setFullName(request.fullName().trim());
        }

        if (StringUtils.hasText(request.email())) {
            String normalizedEmail = normalizeEmail(request.email());
            if (!profile.getEmail().equalsIgnoreCase(normalizedEmail)
                    && userProfileRepository.existsByEmailIgnoreCase(normalizedEmail)) {
                throw new DuplicateUserProfileException("Ja existe um perfil usando este email");
            }
            profile.setEmail(normalizedEmail);
        }

        if (request.phone() != null) {
            profile.setPhone(blankToNull(request.phone()));
        }

        if (request.birthDate() != null) {
            profile.setBirthDate(request.birthDate());
        }

        if (request.gender() != null) {
            profile.setGender(request.gender());
        }

        return toResponse(userProfileRepository.save(profile));
    }

    @Transactional
    public UserProfile getOrCreateProfile(AuthenticatedUser authenticatedUser) {
        return userProfileRepository.findByAuthUserId(authenticatedUser.userId())
                .map(profile -> syncIdentity(profile, authenticatedUser))
                .orElseGet(() -> createProfile(authenticatedUser));
    }

    private UserProfile createProfile(AuthenticatedUser authenticatedUser) {
        UserProfile profile = UserProfile.builder()
                .id(UUID.randomUUID())
                .authUserId(authenticatedUser.userId())
                .fullName(authenticatedUser.fullName().trim())
                .email(normalizeEmail(authenticatedUser.email()))
                .active(true)
                .build();

        return userProfileRepository.save(profile);
    }

    private UserProfile syncIdentity(UserProfile profile, AuthenticatedUser authenticatedUser) {
        boolean changed = false;
        String normalizedEmail = normalizeEmail(authenticatedUser.email());

        if (!profile.getEmail().equalsIgnoreCase(normalizedEmail)) {
            profile.setEmail(normalizedEmail);
            changed = true;
        }

        if (StringUtils.hasText(authenticatedUser.fullName())
                && !profile.getFullName().equals(authenticatedUser.fullName().trim())) {
            profile.setFullName(authenticatedUser.fullName().trim());
            changed = true;
        }

        return changed ? userProfileRepository.save(profile) : profile;
    }

    private UserProfileResponse toResponse(UserProfile profile) {
        return new UserProfileResponse(
                profile.getAuthUserId(),
                profile.getFullName(),
                profile.getEmail(),
                profile.getPhone(),
                profile.getBirthDate(),
                profile.getGender(),
                profile.isActive(),
                profile.getCreatedAt(),
                profile.getUpdatedAt()
        );
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }

    private String blankToNull(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }
}

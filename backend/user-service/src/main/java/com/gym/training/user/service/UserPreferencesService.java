package com.gym.training.user.service;

import com.gym.training.user.controller.request.UpdateUserPreferencesRequest;
import com.gym.training.user.controller.response.UserPreferencesResponse;
import com.gym.training.user.domain.UserPreferences;
import com.gym.training.user.domain.UserProfile;
import com.gym.training.user.repository.UserPreferencesRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class UserPreferencesService {

    private final UserProfileService userProfileService;
    private final UserPreferencesRepository userPreferencesRepository;

    @Transactional
    public UserPreferencesResponse getPreferences(AuthenticatedUser authenticatedUser) {
        return toResponse(getOrCreatePreferences(authenticatedUser));
    }

    @Transactional
    public UserPreferencesResponse updatePreferences(
            AuthenticatedUser authenticatedUser,
            UpdateUserPreferencesRequest request
    ) {
        UserPreferences preferences = getOrCreatePreferences(authenticatedUser);

        if (StringUtils.hasText(request.language())) {
            preferences.setLanguage(request.language().trim());
        }

        if (StringUtils.hasText(request.timezone())) {
            preferences.setTimezone(request.timezone().trim());
        }

        if (request.measurementSystem() != null) {
            preferences.setMeasurementSystem(request.measurementSystem());
        }

        if (request.notificationsEnabled() != null) {
            preferences.setNotificationsEnabled(request.notificationsEnabled());
        }

        if (request.emailNotificationsEnabled() != null) {
            preferences.setEmailNotificationsEnabled(request.emailNotificationsEnabled());
        }

        if (request.pushNotificationsEnabled() != null) {
            preferences.setPushNotificationsEnabled(request.pushNotificationsEnabled());
        }

        if (request.aiCoachPersonalizationEnabled() != null) {
            preferences.setAiCoachPersonalizationEnabled(request.aiCoachPersonalizationEnabled());
        }

        return toResponse(userPreferencesRepository.save(preferences));
    }

    @Transactional
    public UserPreferences getOrCreatePreferences(AuthenticatedUser authenticatedUser) {
        return userPreferencesRepository.findByUserProfileAuthUserId(authenticatedUser.userId())
                .orElseGet(() -> createPreferences(authenticatedUser));
    }

    private UserPreferences createPreferences(AuthenticatedUser authenticatedUser) {
        UserProfile profile = userProfileService.getOrCreateProfile(authenticatedUser);
        UserPreferences preferences = UserPreferences.builder()
                .id(UUID.randomUUID())
                .userProfile(profile)
                .build();

        return userPreferencesRepository.save(preferences);
    }

    private UserPreferencesResponse toResponse(UserPreferences preferences) {
        return new UserPreferencesResponse(
                preferences.getUserProfile().getAuthUserId(),
                preferences.getLanguage(),
                preferences.getTimezone(),
                preferences.getMeasurementSystem(),
                preferences.isNotificationsEnabled(),
                preferences.isEmailNotificationsEnabled(),
                preferences.isPushNotificationsEnabled(),
                preferences.isAiCoachPersonalizationEnabled(),
                preferences.getUpdatedAt()
        );
    }
}

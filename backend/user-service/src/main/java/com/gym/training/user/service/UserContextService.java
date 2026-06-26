package com.gym.training.user.service;

import com.gym.training.user.controller.response.UserAiCoachContextResponse;
import com.gym.training.user.controller.response.UserDashboardContextResponse;
import com.gym.training.user.domain.UserFitnessContext;
import com.gym.training.user.domain.UserPreferences;
import com.gym.training.user.domain.UserPremiumSnapshot;
import com.gym.training.user.domain.UserProfile;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserContextService {

    private final UserProfileService userProfileService;
    private final UserFitnessContextService userFitnessContextService;
    private final UserPreferencesService userPreferencesService;
    private final UserPremiumService userPremiumService;

    @Transactional
    public UserDashboardContextResponse getDashboardContext(AuthenticatedUser authenticatedUser) {
        UserProfile profile = userProfileService.getOrCreateProfile(authenticatedUser);
        UserFitnessContext fitnessContext = userFitnessContextService.getOrCreateFitnessContext(authenticatedUser);
        UserPremiumSnapshot premiumSnapshot = userPremiumService.getOrCreatePremiumSnapshot(authenticatedUser);

        return new UserDashboardContextResponse(
                profile.getAuthUserId(),
                profile.getFullName(),
                profile.getEmail(),
                premiumSnapshot.isPremiumActive(),
                premiumSnapshot.getPlanName(),
                enumName(fitnessContext.getMainGoal()),
                enumName(fitnessContext.getExperienceLevel()),
                enumName(fitnessContext.getActivityLevel()),
                enumName(fitnessContext.getPreferredTrainingTime()),
                fitnessContext.getTrainingFrequencyPerWeek()
        );
    }

    @Transactional
    public UserAiCoachContextResponse getAiCoachContext(AuthenticatedUser authenticatedUser) {
        UserProfile profile = userProfileService.getOrCreateProfile(authenticatedUser);
        UserFitnessContext fitnessContext = userFitnessContextService.getOrCreateFitnessContext(authenticatedUser);
        UserPreferences preferences = userPreferencesService.getOrCreatePreferences(authenticatedUser);
        UserPremiumSnapshot premiumSnapshot = userPremiumService.getOrCreatePremiumSnapshot(authenticatedUser);

        return new UserAiCoachContextResponse(
                profile.getAuthUserId(),
                profile.getFullName(),
                premiumSnapshot.isPremiumActive(),
                preferences.isAiCoachPersonalizationEnabled(),
                enumName(fitnessContext.getMainGoal()),
                enumName(fitnessContext.getExperienceLevel()),
                enumName(fitnessContext.getActivityLevel()),
                enumName(fitnessContext.getPreferredTrainingTime()),
                fitnessContext.getTrainingFrequencyPerWeek(),
                enumName(fitnessContext.getDietaryPreference()),
                fitnessContext.getFoodRestrictions(),
                fitnessContext.getInjuryNotes(),
                fitnessContext.getMedicalNotes()
        );
    }

    private String enumName(Enum<?> value) {
        return value == null ? null : value.name();
    }
}

package com.gym.training.user.service;

import com.gym.training.user.controller.request.UpdateUserFitnessContextRequest;
import com.gym.training.user.controller.response.UserFitnessContextResponse;
import com.gym.training.user.domain.UserFitnessContext;
import com.gym.training.user.domain.UserProfile;
import com.gym.training.user.repository.UserFitnessContextRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class UserFitnessContextService {

    private final UserProfileService userProfileService;
    private final UserFitnessContextRepository userFitnessContextRepository;

    @Transactional
    public UserFitnessContextResponse getFitnessContext(AuthenticatedUser authenticatedUser) {
        return toResponse(getOrCreateFitnessContext(authenticatedUser));
    }

    @Transactional
    public UserFitnessContextResponse updateFitnessContext(
            AuthenticatedUser authenticatedUser,
            UpdateUserFitnessContextRequest request
    ) {
        UserFitnessContext context = getOrCreateFitnessContext(authenticatedUser);

        context.setMainGoal(request.mainGoal());
        context.setExperienceLevel(request.experienceLevel());
        context.setHeightCm(request.heightCm());
        context.setWeightKg(request.weightKg());
        context.setActivityLevel(request.activityLevel());
        context.setTrainingFrequencyPerWeek(request.trainingFrequencyPerWeek());
        context.setPreferredTrainingTime(request.preferredTrainingTime());
        context.setDietaryPreference(request.dietaryPreference());
        context.setFoodRestrictions(blankToNull(request.foodRestrictions()));
        context.setInjuryNotes(blankToNull(request.injuryNotes()));
        context.setMedicalNotes(blankToNull(request.medicalNotes()));

        return toResponse(userFitnessContextRepository.save(context));
    }

    @Transactional
    public UserFitnessContext getOrCreateFitnessContext(AuthenticatedUser authenticatedUser) {
        return userFitnessContextRepository.findByUserProfileAuthUserId(authenticatedUser.userId())
                .orElseGet(() -> createFitnessContext(authenticatedUser));
    }

    private UserFitnessContext createFitnessContext(AuthenticatedUser authenticatedUser) {
        UserProfile profile = userProfileService.getOrCreateProfile(authenticatedUser);
        UserFitnessContext context = UserFitnessContext.builder()
                .id(UUID.randomUUID())
                .userProfile(profile)
                .build();

        return userFitnessContextRepository.save(context);
    }

    private UserFitnessContextResponse toResponse(UserFitnessContext context) {
        return new UserFitnessContextResponse(
                context.getUserProfile().getAuthUserId(),
                context.getMainGoal(),
                context.getExperienceLevel(),
                context.getHeightCm(),
                context.getWeightKg(),
                context.getActivityLevel(),
                context.getTrainingFrequencyPerWeek(),
                context.getPreferredTrainingTime(),
                context.getDietaryPreference(),
                context.getFoodRestrictions(),
                context.getInjuryNotes(),
                context.getMedicalNotes(),
                context.getUpdatedAt()
        );
    }

    private String blankToNull(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }
}

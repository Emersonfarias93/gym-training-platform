package com.gym.training.user.controller;

import com.gym.training.user.controller.request.UpdateUserFitnessContextRequest;
import com.gym.training.user.controller.request.UpdateUserPreferencesRequest;
import com.gym.training.user.controller.request.UpdateUserProfileRequest;
import com.gym.training.user.controller.response.UserAiCoachContextResponse;
import com.gym.training.user.controller.response.UserDashboardContextResponse;
import com.gym.training.user.controller.response.UserFitnessContextResponse;
import com.gym.training.user.controller.response.UserPreferencesResponse;
import com.gym.training.user.controller.response.UserPremiumStatusResponse;
import com.gym.training.user.controller.response.UserProfileResponse;
import com.gym.training.user.service.AuthenticatedUser;
import com.gym.training.user.service.CurrentUserResolver;
import com.gym.training.user.service.UserContextService;
import com.gym.training.user.service.UserFitnessContextService;
import com.gym.training.user.service.UserPreferencesService;
import com.gym.training.user.service.UserPremiumService;
import com.gym.training.user.service.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users/me")
@RequiredArgsConstructor
public class UserController {

    private static final String USER_ID_HEADER = "X-User-Id";
    private static final String USER_EMAIL_HEADER = "X-User-Email";
    private static final String USER_FULL_NAME_HEADER = "X-User-Full-Name";

    private final CurrentUserResolver currentUserResolver;
    private final UserProfileService userProfileService;
    private final UserFitnessContextService userFitnessContextService;
    private final UserPreferencesService userPreferencesService;
    private final UserPremiumService userPremiumService;
    private final UserContextService userContextService;

    @GetMapping
    public UserProfileResponse getProfile(
            @RequestHeader(USER_ID_HEADER) String userId,
            @RequestHeader(USER_EMAIL_HEADER) String email,
            @RequestHeader(value = USER_FULL_NAME_HEADER, required = false) String fullName
    ) {
        return userProfileService.getProfile(resolveUser(userId, email, fullName));
    }

    @PatchMapping
    public UserProfileResponse updateProfile(
            @RequestHeader(USER_ID_HEADER) String userId,
            @RequestHeader(USER_EMAIL_HEADER) String email,
            @RequestHeader(value = USER_FULL_NAME_HEADER, required = false) String fullName,
            @Valid @RequestBody UpdateUserProfileRequest request
    ) {
        return userProfileService.updateProfile(resolveUser(userId, email, fullName), request);
    }

    @GetMapping("/fitness-context")
    public UserFitnessContextResponse getFitnessContext(
            @RequestHeader(USER_ID_HEADER) String userId,
            @RequestHeader(USER_EMAIL_HEADER) String email,
            @RequestHeader(value = USER_FULL_NAME_HEADER, required = false) String fullName
    ) {
        return userFitnessContextService.getFitnessContext(resolveUser(userId, email, fullName));
    }

    @PutMapping("/fitness-context")
    public UserFitnessContextResponse updateFitnessContext(
            @RequestHeader(USER_ID_HEADER) String userId,
            @RequestHeader(USER_EMAIL_HEADER) String email,
            @RequestHeader(value = USER_FULL_NAME_HEADER, required = false) String fullName,
            @Valid @RequestBody UpdateUserFitnessContextRequest request
    ) {
        return userFitnessContextService.updateFitnessContext(resolveUser(userId, email, fullName), request);
    }

    @GetMapping("/preferences")
    public UserPreferencesResponse getPreferences(
            @RequestHeader(USER_ID_HEADER) String userId,
            @RequestHeader(USER_EMAIL_HEADER) String email,
            @RequestHeader(value = USER_FULL_NAME_HEADER, required = false) String fullName
    ) {
        return userPreferencesService.getPreferences(resolveUser(userId, email, fullName));
    }

    @PatchMapping("/preferences")
    public UserPreferencesResponse updatePreferences(
            @RequestHeader(USER_ID_HEADER) String userId,
            @RequestHeader(USER_EMAIL_HEADER) String email,
            @RequestHeader(value = USER_FULL_NAME_HEADER, required = false) String fullName,
            @Valid @RequestBody UpdateUserPreferencesRequest request
    ) {
        return userPreferencesService.updatePreferences(resolveUser(userId, email, fullName), request);
    }

    @GetMapping("/premium-status")
    public UserPremiumStatusResponse getPremiumStatus(
            @RequestHeader(USER_ID_HEADER) String userId,
            @RequestHeader(USER_EMAIL_HEADER) String email,
            @RequestHeader(value = USER_FULL_NAME_HEADER, required = false) String fullName
    ) {
        return userPremiumService.getPremiumStatus(resolveUser(userId, email, fullName));
    }

    @GetMapping("/dashboard-context")
    public UserDashboardContextResponse getDashboardContext(
            @RequestHeader(USER_ID_HEADER) String userId,
            @RequestHeader(USER_EMAIL_HEADER) String email,
            @RequestHeader(value = USER_FULL_NAME_HEADER, required = false) String fullName
    ) {
        return userContextService.getDashboardContext(resolveUser(userId, email, fullName));
    }

    @GetMapping("/ai-coach-context")
    public UserAiCoachContextResponse getAiCoachContext(
            @RequestHeader(USER_ID_HEADER) String userId,
            @RequestHeader(USER_EMAIL_HEADER) String email,
            @RequestHeader(value = USER_FULL_NAME_HEADER, required = false) String fullName
    ) {
        return userContextService.getAiCoachContext(resolveUser(userId, email, fullName));
    }

    private AuthenticatedUser resolveUser(String userId, String email, String fullName) {
        return currentUserResolver.resolve(userId, email, fullName);
    }
}

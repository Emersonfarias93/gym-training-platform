package com.gym.training.user.controller.response;

import com.gym.training.user.domain.Gender;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record UserProfileResponse(
        UUID userId,
        String fullName,
        String email,
        String phone,
        LocalDate birthDate,
        Gender gender,
        boolean active,
        Instant createdAt,
        Instant updatedAt
) {
}

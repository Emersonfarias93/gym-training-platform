package com.gym.training.auth.controller.request;

import com.gym.training.auth.domain.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterUserRequest(
        @NotBlank
        @Size(max = 120)
        String fullName,
        @NotBlank
        @Email
        @Size(max = 150)
        String email,
        @NotBlank
        @Size(min = 8, max = 64)
        String password,
        UserRole role
) {
}

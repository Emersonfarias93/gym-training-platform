package com.gym.training.auth.controller.request;

import jakarta.validation.constraints.NotBlank;

public record TokenValidationRequest(
        @NotBlank
        String token
) {
}

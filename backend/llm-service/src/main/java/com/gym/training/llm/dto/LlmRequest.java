package com.gym.training.llm.dto;

import jakarta.validation.constraints.NotBlank;

public record LlmRequest(@NotBlank String prompt) {
}

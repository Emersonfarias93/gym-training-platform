package com.gym.training.llm.controller;

import com.gym.training.llm.service.LlmService;
import com.gym.training.llm.dto.LlmRequest;
import com.gym.training.llm.dto.LlmResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/llm")
public class LlmController {

    private final LlmService llmService;

    public LlmController(LlmService llmService) {
        this.llmService = llmService;
    }

    @PostMapping("/generate")
    public ResponseEntity<LlmResponse> generate(@Valid @RequestBody LlmRequest request) {
        String generation = llmService.generate(request.prompt());
        return ResponseEntity.ok(new LlmResponse(generation));
    }
}

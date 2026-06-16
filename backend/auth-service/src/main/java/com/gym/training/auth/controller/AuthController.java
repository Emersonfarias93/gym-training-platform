package com.gym.training.auth.controller;

import com.gym.training.auth.controller.request.AuthRequest;
import com.gym.training.auth.controller.request.RegisterUserRequest;
import com.gym.training.auth.controller.request.TokenValidationRequest;
import com.gym.training.auth.controller.response.AuthResponse;
import com.gym.training.auth.controller.response.TokenValidationResponse;
import com.gym.training.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterUserRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody AuthRequest request) {
        return authService.authenticate(request);
    }

    @PostMapping("/validate")
    public TokenValidationResponse validate(@Valid @RequestBody TokenValidationRequest request) {
        return authService.validateToken(request);
    }
}

package com.gym.training.auth.service;

import com.gym.training.auth.controller.request.AuthRequest;
import com.gym.training.auth.controller.request.RegisterUserRequest;
import com.gym.training.auth.controller.request.TokenValidationRequest;
import com.gym.training.auth.controller.response.AuthResponse;
import com.gym.training.auth.controller.response.TokenValidationResponse;
import com.gym.training.auth.domain.UserCredential;
import com.gym.training.auth.domain.UserRole;
import com.gym.training.auth.exception.DuplicateUserException;
import com.gym.training.auth.repository.UserCredentialRepository;
import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final String TOKEN_TYPE = "Bearer";

    private final UserCredentialRepository userCredentialRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthEventPublisher authEventPublisher;

    @Transactional
    public AuthResponse register(RegisterUserRequest request) {
        String normalizedEmail = normalizeEmail(request.email());

        if (userCredentialRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new DuplicateUserException("Usuário já cadastrado para o e-mail informado");
        }

        UserCredential userCredential = UserCredential.builder()
                .id(UUID.randomUUID())
                .fullName(request.fullName().trim())
                .email(normalizedEmail)
                .password(passwordEncoder.encode(request.password()))
                .role(resolveRole(request.role()))
                .active(true)
                .build();

        UserCredential savedUser = userCredentialRepository.save(userCredential);
        authEventPublisher.publishUserRegistered(savedUser);

        return buildAuthResponse(savedUser);
    }

    @Transactional(readOnly = true)
    public AuthResponse authenticate(AuthRequest request) {
        UserCredential userCredential = userCredentialRepository.findByEmailIgnoreCase(normalizeEmail(request.email()))
                .orElseThrow(() -> new BadCredentialsException("Credenciais inválidas"));

        if (!userCredential.isEnabled()) {
            throw new DisabledException("Usuário inativo");
        }

        if (!passwordEncoder.matches(request.password(), userCredential.getPassword())) {
            throw new BadCredentialsException("Credenciais inválidas");
        }

        authEventPublisher.publishUserAuthenticated(userCredential);

        return buildAuthResponse(userCredential);
    }

    @Transactional(readOnly = true)
    public TokenValidationResponse validateToken(TokenValidationRequest request) {
        String username = jwtService.extractUsername(request.token());
        UserCredential userCredential = userCredentialRepository.findByEmailIgnoreCase(normalizeEmail(username))
                .orElseThrow(() -> new BadCredentialsException("Token inválido"));

        boolean valid = jwtService.isTokenValid(request.token(), userCredential);

        if (valid) {
            authEventPublisher.publishTokenValidated(userCredential);
        }

        return new TokenValidationResponse(
                valid,
                valid ? userCredential.getId() : null,
                valid ? userCredential.getEmail() : null,
                valid ? userCredential.getRole() : null
        );
    }

    private AuthResponse buildAuthResponse(UserCredential userCredential) {
        String token = jwtService.generateToken(userCredential);

        return new AuthResponse(
                userCredential.getId(),
                userCredential.getFullName(),
                userCredential.getEmail(),
                userCredential.getRole(),
                token,
                TOKEN_TYPE,
                Instant.now().plusMillis(jwtService.getExpirationMs())
        );
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }

    private UserRole resolveRole(UserRole role) {
        return role == null ? UserRole.USER : role;
    }
}

package com.gym.training.auth.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import com.gym.training.auth.controller.request.RegisterUserRequest;
import com.gym.training.auth.domain.UserCredential;
import com.gym.training.auth.domain.UserRole;
import com.gym.training.auth.repository.UserCredentialRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {
    @Mock UserCredentialRepository repository;
    @Mock PasswordEncoder encoder;
    @Mock JwtService jwt;
    @Mock AuthEventPublisher publisher;
    @InjectMocks AuthService service;

    @Test
    void publicRegistrationCannotCreateAdministrator() {
        when(encoder.encode("password123")).thenReturn("encoded");
        when(repository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        service.register(new RegisterUserRequest("Aluno", "ALUNO@example.com", "password123", UserRole.ADMIN));
        var saved = ArgumentCaptor.forClass(UserCredential.class);
        verify(repository).save(saved.capture());
        assertEquals(UserRole.USER, saved.getValue().getRole());
        assertEquals("aluno@example.com", saved.getValue().getEmail());
        assertEquals("encoded", saved.getValue().getPassword());
    }
}

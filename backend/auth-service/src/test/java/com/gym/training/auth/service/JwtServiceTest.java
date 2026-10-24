package com.gym.training.auth.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import java.util.Base64;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;

class JwtServiceTest {
    private final JwtService service = new JwtService(
            Base64.getEncoder().encodeToString(new byte[32]), 60_000);

    @Test
    void tokenStopsWorkingWhenAccountIsDisabled() {
        var active = User.withUsername("aluno@example.com").password("encoded").roles("USER").build();
        String token = service.generateToken(active);
        assertTrue(service.isTokenValid(token, active));
        var disabled = User.withUsername("aluno@example.com").password("encoded").roles("USER").disabled(true).build();
        assertFalse(service.isTokenValid(token, disabled));
    }
}

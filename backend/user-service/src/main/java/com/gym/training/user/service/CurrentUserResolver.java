package com.gym.training.user.service;

import com.gym.training.user.exception.UnauthorizedUserException;
import java.util.UUID;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class CurrentUserResolver {

    public AuthenticatedUser resolve(String userId, String email, String fullName) {
        if (!StringUtils.hasText(userId) || !StringUtils.hasText(email)) {
            throw new UnauthorizedUserException("Contexto de usuario autenticado ausente");
        }

        try {
            String normalizedEmail = email.trim().toLowerCase();
            String resolvedFullName = StringUtils.hasText(fullName) ? fullName.trim() : normalizedEmail;
            return new AuthenticatedUser(UUID.fromString(userId), normalizedEmail, resolvedFullName);
        } catch (IllegalArgumentException exception) {
            throw new UnauthorizedUserException("Contexto de usuario autenticado invalido");
        }
    }
}

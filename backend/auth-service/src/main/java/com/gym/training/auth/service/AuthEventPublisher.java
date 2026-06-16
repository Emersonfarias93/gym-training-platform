package com.gym.training.auth.service;

import com.gym.training.auth.domain.UserCredential;
import com.gym.training.auth.event.AuthEvent;
import com.gym.training.auth.event.AuthEventType;
import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class AuthEventPublisher {

    private static final String SOURCE_SERVICE = "auth-service";

    private final KafkaTemplate<String, AuthEvent> kafkaTemplate;

    @Value("${application.kafka.topics.auth-events}")
    private String authEventsTopic;

    public void publishUserRegistered(UserCredential userCredential) {
        publishEvent(userCredential, AuthEventType.USER_REGISTERED);
    }

    public void publishUserAuthenticated(UserCredential userCredential) {
        publishEvent(userCredential, AuthEventType.USER_AUTHENTICATED);
    }

    public void publishTokenValidated(UserCredential userCredential) {
        publishEvent(userCredential, AuthEventType.TOKEN_VALIDATED);
    }

    private void publishEvent(UserCredential userCredential, AuthEventType eventType) {
        AuthEvent event = new AuthEvent(
                UUID.randomUUID(),
                eventType,
                Instant.now(),
                userCredential.getId(),
                userCredential.getEmail(),
                userCredential.getRole(),
                SOURCE_SERVICE
        );

        try {
            kafkaTemplate.send(authEventsTopic, userCredential.getId().toString(), event);
        } catch (RuntimeException exception) {
            log.warn("Falha ao publicar evento {} para o usuário {}", eventType, userCredential.getEmail(), exception);
        }
    }
}

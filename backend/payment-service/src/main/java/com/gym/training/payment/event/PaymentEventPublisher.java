package com.gym.training.payment.event;

import com.gym.training.payment.domain.PixTransaction;
import java.time.Instant;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class PaymentEventPublisher {

    private static final Logger LOGGER = LoggerFactory.getLogger(PaymentEventPublisher.class);
    private static final String SOURCE_SERVICE = "payment-service";

    private final KafkaTemplate<String, PaymentConfirmedEvent> kafkaTemplate;

    @Value("${application.kafka.topics.payment-events}")
    private String paymentEventsTopic;

    public PaymentEventPublisher(KafkaTemplate<String, PaymentConfirmedEvent> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishPaymentConfirmed(PixTransaction transaction) {
        PaymentConfirmedEvent event = new PaymentConfirmedEvent(
                UUID.randomUUID(),
                Instant.now(),
                transaction.getAuthUserId(),
                transaction.getUserEmail(),
                transaction.getUserFullName(),
                transaction.getPlanName(),
                transaction.getAmount(),
                transaction.getConfrapixUuid(),
                SOURCE_SERVICE
        );

        try {
            kafkaTemplate.send(paymentEventsTopic, transaction.getAuthUserId().toString(), event);
        } catch (RuntimeException exception) {
            // Nao vaza dados sensiveis: apenas o id do usuario.
            LOGGER.warn("Falha ao publicar PaymentConfirmedEvent para o usuario {}", transaction.getAuthUserId(), exception);
        }
    }
}

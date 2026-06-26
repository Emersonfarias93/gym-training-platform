package com.gym.training.user.kafka;

import com.gym.training.user.service.UserPremiumService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class PaymentConfirmedEventListener {

    private final UserPremiumService userPremiumService;

    @KafkaListener(topics = "${application.kafka.topics.payment-events}")
    public void onPaymentConfirmed(PaymentConfirmedEvent event) {
        if (event == null || event.userId() == null) {
            log.warn("Evento de pagamento invalido recebido (sem userId).");
            return;
        }

        log.info("Pagamento confirmado recebido. userId={}, transactionUuid={}", event.userId(), event.transactionUuid());
        userPremiumService.activatePremium(event.userId(), event.email(), event.fullName(), event.planName());
    }
}

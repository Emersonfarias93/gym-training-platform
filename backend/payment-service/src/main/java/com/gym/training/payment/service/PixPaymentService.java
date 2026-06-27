package com.gym.training.payment.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.gym.training.payment.client.ConfrapixTransactionClient;
import com.gym.training.payment.config.ConfrapixProperties;
import com.gym.training.payment.controller.request.StorePixTransactionRequest;
import com.gym.training.payment.domain.PixTransaction;
import com.gym.training.payment.event.PaymentEventPublisher;
import com.gym.training.payment.repository.PixTransactionRepository;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class PixPaymentService {

    private static final Logger LOGGER = LoggerFactory.getLogger(PixPaymentService.class);
    private static final DateTimeFormatter EXPIRATION_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final ConfrapixTransactionClient confrapixTransactionClient;
    private final ConfrapixProperties properties;
    private final PixTransactionRepository pixTransactionRepository;
    private final PaymentEventPublisher paymentEventPublisher;
    private final PremiumAccessService premiumAccessService;

    @Value("${payment.pix.expiration-minutes:15}")
    private long expirationMinutes;

    public PixPaymentService(
            ConfrapixTransactionClient confrapixTransactionClient,
            ConfrapixProperties properties,
            PixTransactionRepository pixTransactionRepository,
            PaymentEventPublisher paymentEventPublisher,
            PremiumAccessService premiumAccessService
    ) {
        this.confrapixTransactionClient = confrapixTransactionClient;
        this.properties = properties;
        this.pixTransactionRepository = pixTransactionRepository;
        this.paymentEventPublisher = paymentEventPublisher;
        this.premiumAccessService = premiumAccessService;
    }

    @Transactional
    public JsonNode storeTransaction(StorePixTransactionRequest request, PaymentRequester requester) {
        applyDefaultCallbackUrl(request);
        applyExpiration(request);
        JsonNode response = confrapixTransactionClient.store(request);
        persistTransaction(response, request, requester);
        return response;
    }

    public JsonNode showTransaction(String transactionId) {
        return confrapixTransactionClient.show(transactionId);
    }

    public JsonNode version() {
        return confrapixTransactionClient.version();
    }

    @Transactional
    public void handleTransactionCallback(JsonNode payload) {
        String uuid = payload.path("uuid").asText(null);
        String status = payload.path("status").asText(null);
        boolean confirmed = payload.path("confirmed").asBoolean(false);

        LOGGER.info("Callback Confrapix recebido. uuid={}, status={}, confirmed={}", uuid, status, confirmed);

        boolean paid = "succeeded".equals(status) || confirmed;
        if (!paid || uuid == null) {
            return;
        }

        pixTransactionRepository.findByConfrapixUuid(uuid).ifPresentOrElse(
                transaction -> confirmTransaction(transaction, status),
                () -> LOGGER.warn("Callback de pagamento sem transacao correspondente. uuid={}", uuid)
        );
    }

    private void confirmTransaction(PixTransaction transaction, String status) {
        if (transaction.isProcessed()) {
            // Idempotencia: o mesmo callback pode chegar mais de uma vez.
            LOGGER.info("Pagamento ja processado, ignorando reentrega. uuid={}", transaction.getConfrapixUuid());
            premiumAccessService.grantMonthlyAccess(transaction);
            return;
        }

        transaction.setStatus(status != null ? status : "succeeded");
        transaction.setPaidAt(Instant.now());
        transaction.setProcessed(true);
        pixTransactionRepository.save(transaction);

        premiumAccessService.grantMonthlyAccess(transaction);
        paymentEventPublisher.publishPaymentConfirmed(transaction);
        LOGGER.info("Pagamento Pix confirmado e evento publicado. uuid={}", transaction.getConfrapixUuid());
    }

    private void persistTransaction(JsonNode response, StorePixTransactionRequest request, PaymentRequester requester) {
        if (requester == null || !requester.hasUserId()) {
            // Sem identidade (ex.: chamada sem header) nao da para correlacionar o pagamento.
            LOGGER.warn("Transacao Pix criada sem userId; webhook nao podera ativar premium.");
            return;
        }

        JsonNode transaction = response.path("transaction");
        String uuid = transaction.path("uuid").asText(null);
        if (uuid == null) {
            LOGGER.warn("Resposta da Confrapix sem uuid; transacao nao persistida.");
            return;
        }

        PixTransaction entity = new PixTransaction();
        entity.setId(UUID.randomUUID());
        entity.setConfrapixUuid(uuid);
        entity.setConfrapixTransactionId(transaction.path("id").asText(null));
        entity.setAuthUserId(requester.userId());
        entity.setUserEmail(requester.email());
        entity.setUserFullName(requester.fullName());
        entity.setPlanName(requester.planName());
        entity.setAmount(request.getAmount());
        entity.setStatus(transaction.path("status").asText("processing"));
        entity.setProcessed(false);

        pixTransactionRepository.save(entity);
    }

    private void applyDefaultCallbackUrl(StorePixTransactionRequest request) {
        if (!StringUtils.hasText(request.getCallbackUrl()) && StringUtils.hasText(properties.callbackUrl())) {
            request.setCallbackUrl(properties.callbackUrl());
        }
    }

    private void applyExpiration(StorePixTransactionRequest request) {
        // Politica de expiracao imposta pelo backend (nao confia no valor do cliente).
        String expiration = LocalDateTime.now().plusMinutes(expirationMinutes).format(EXPIRATION_FORMATTER);
        request.setExpiredIn(expiration);
    }
}

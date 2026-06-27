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
import java.util.Locale;
import java.util.Optional;
import java.util.Set;
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
    private static final Set<String> PAID_STATUSES = Set.of("succeeded", "paid", "confirmed", "approved", "completed");

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
        LOGGER.info(
                "Criando cobranca Pix. userId={}, callbackConfigurado={}, callbackUrl={}",
                requester != null ? requester.userId() : null,
                StringUtils.hasText(request.getCallbackUrl()),
                maskCallbackUrl(request.getCallbackUrl())
        );
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
        String uuid = extractText(payload, "/uuid", "/transaction/uuid", "/data/uuid");
        String transactionId = extractText(payload, "/transaction/id", "/id", "/transaction/transaction_id", "/data/id");
        String status = extractText(payload, "/status", "/transaction/status", "/data/status");
        boolean confirmed = extractBoolean(payload, "/confirmed", "/transaction/confirmed", "/data/confirmed");

        LOGGER.info(
                "Callback Confrapix recebido. uuid={}, transactionId={}, status={}, confirmed={}",
                uuid,
                transactionId,
                status,
                confirmed
        );

        boolean paid = isPaidStatus(status) || confirmed;
        if (!paid || (!StringUtils.hasText(uuid) && !StringUtils.hasText(transactionId))) {
            return;
        }

        findTransactionByCallbackReference(uuid, transactionId).ifPresentOrElse(
                transaction -> confirmTransaction(transaction, status),
                () -> LOGGER.warn(
                        "Callback de pagamento sem transacao correspondente. uuid={}, transactionId={}",
                        uuid,
                        transactionId
                )
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

    private Optional<PixTransaction> findTransactionByCallbackReference(String uuid, String transactionId) {
        if (StringUtils.hasText(uuid)) {
            Optional<PixTransaction> byUuid = pixTransactionRepository.findByConfrapixUuid(uuid);
            if (byUuid.isPresent()) {
                return byUuid;
            }
        }

        if (StringUtils.hasText(transactionId)) {
            return pixTransactionRepository.findByConfrapixTransactionId(transactionId);
        }

        return Optional.empty();
    }

    private boolean isPaidStatus(String status) {
        if (!StringUtils.hasText(status)) {
            return false;
        }

        return PAID_STATUSES.contains(status.toLowerCase(Locale.ROOT));
    }

    private static String extractText(JsonNode payload, String... jsonPointers) {
        for (String jsonPointer : jsonPointers) {
            JsonNode node = payload.at(jsonPointer);
            if (node != null && !node.isMissingNode() && !node.isNull()) {
                String value = node.asText(null);
                if (StringUtils.hasText(value)) {
                    return value;
                }
            }
        }

        return null;
    }

    private static boolean extractBoolean(JsonNode payload, String... jsonPointers) {
        for (String jsonPointer : jsonPointers) {
            JsonNode node = payload.at(jsonPointer);
            if (node != null && !node.isMissingNode() && !node.isNull()) {
                return node.asBoolean(false);
            }
        }

        return false;
    }

    private static String maskCallbackUrl(String callbackUrl) {
        if (!StringUtils.hasText(callbackUrl)) {
            return null;
        }

        int tokenIndex = callbackUrl.indexOf("token=");
        if (tokenIndex < 0) {
            return callbackUrl;
        }

        return callbackUrl.substring(0, tokenIndex) + "token=***";
    }
}

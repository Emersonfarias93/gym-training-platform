package com.gym.training.payment.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.gym.training.payment.client.ConfrapixTransactionClient;
import com.gym.training.payment.config.ConfrapixProperties;
import com.gym.training.payment.controller.request.StorePixTransactionRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class PixPaymentService {

    private static final Logger LOGGER = LoggerFactory.getLogger(PixPaymentService.class);

    private final ConfrapixTransactionClient confrapixTransactionClient;
    private final ConfrapixProperties properties;

    public PixPaymentService(ConfrapixTransactionClient confrapixTransactionClient, ConfrapixProperties properties) {
        this.confrapixTransactionClient = confrapixTransactionClient;
        this.properties = properties;
    }

    public JsonNode storeTransaction(StorePixTransactionRequest request) {
        applyDefaultCallbackUrl(request);
        return confrapixTransactionClient.store(request);
    }

    public JsonNode showTransaction(String transactionId) {
        return confrapixTransactionClient.show(transactionId);
    }

    public JsonNode version() {
        return confrapixTransactionClient.version();
    }

    public void handleTransactionCallback(JsonNode payload) {
        String uuid = payload.path("uuid").asText(null);
        String status = payload.path("status").asText(null);
        boolean confirmed = payload.path("confirmed").asBoolean(false);

        LOGGER.info(
                "Callback Confrapix recebido. uuid={}, status={}, confirmed={}",
                uuid,
                status,
                confirmed
        );

        if ("succeeded".equals(status) || confirmed) {
            LOGGER.info("Pagamento Pix confirmado pela Confrapix. uuid={}", uuid);
        }
    }

    private void applyDefaultCallbackUrl(StorePixTransactionRequest request) {
        if (!StringUtils.hasText(request.getCallbackUrl()) && StringUtils.hasText(properties.callbackUrl())) {
            request.setCallbackUrl(properties.callbackUrl());
        }
    }
}

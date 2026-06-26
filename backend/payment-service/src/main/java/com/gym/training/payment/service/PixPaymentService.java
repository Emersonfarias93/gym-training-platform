package com.gym.training.payment.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.gym.training.payment.client.ConfrapixTransactionClient;
import com.gym.training.payment.controller.request.StorePixTransactionRequest;
import org.springframework.stereotype.Service;

@Service
public class PixPaymentService {

    private final ConfrapixTransactionClient confrapixTransactionClient;

    public PixPaymentService(ConfrapixTransactionClient confrapixTransactionClient) {
        this.confrapixTransactionClient = confrapixTransactionClient;
    }

    public JsonNode storeTransaction(StorePixTransactionRequest request) {
        return confrapixTransactionClient.store(request);
    }
}

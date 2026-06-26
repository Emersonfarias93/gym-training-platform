package com.gym.training.payment.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.gym.training.payment.controller.request.StorePixTransactionRequest;
import com.gym.training.payment.exception.ConfrapixApiException;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class ConfrapixTransactionClient {

    private static final String VERSION_PATH = "/api";
    private static final String STORE_TRANSACTION_PATH = "/api/transaction-ec/store";
    private static final String SHOW_TRANSACTION_PATH = "/api/transaction-ec/show/{transactionId}";

    private final RestClient confrapixRestClient;

    public ConfrapixTransactionClient(RestClient confrapixRestClient) {
        this.confrapixRestClient = confrapixRestClient;
    }

    public JsonNode store(StorePixTransactionRequest request) {
        return confrapixRestClient
                .post()
                .uri(STORE_TRANSACTION_PATH)
                .body(request)
                .retrieve()
                .onStatus(HttpStatusCode::isError, (httpRequest, response) -> {
                    String responseBody = new String(response.getBody().readAllBytes());
                    throw new ConfrapixApiException(response.getStatusCode(), responseBody);
                })
                .body(JsonNode.class);
    }

    public JsonNode show(String transactionId) {
        return confrapixRestClient
                .get()
                .uri(SHOW_TRANSACTION_PATH, transactionId)
                .retrieve()
                .onStatus(HttpStatusCode::isError, (httpRequest, response) -> {
                    String responseBody = new String(response.getBody().readAllBytes());
                    throw new ConfrapixApiException(response.getStatusCode(), responseBody);
                })
                .body(JsonNode.class);
    }

    public JsonNode version() {
        return confrapixRestClient
                .get()
                .uri(VERSION_PATH)
                .retrieve()
                .onStatus(HttpStatusCode::isError, (httpRequest, response) -> {
                    String responseBody = new String(response.getBody().readAllBytes());
                    throw new ConfrapixApiException(response.getStatusCode(), responseBody);
                })
                .body(JsonNode.class);
    }
}

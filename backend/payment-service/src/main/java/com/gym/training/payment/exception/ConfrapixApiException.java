package com.gym.training.payment.exception;

import org.springframework.http.HttpStatusCode;

public class ConfrapixApiException extends RuntimeException {

    private final HttpStatusCode statusCode;
    private final String responseBody;

    public ConfrapixApiException(HttpStatusCode statusCode, String responseBody) {
        super("Erro ao consumir API Confrapix. Status externo: " + statusCode.value());
        this.statusCode = statusCode;
        this.responseBody = responseBody;
    }

    public HttpStatusCode getStatusCode() {
        return statusCode;
    }

    public String getResponseBody() {
        return responseBody;
    }
}

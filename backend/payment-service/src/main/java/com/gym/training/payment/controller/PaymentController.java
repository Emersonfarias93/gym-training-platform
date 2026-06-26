package com.gym.training.payment.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.gym.training.payment.controller.request.StorePixTransactionRequest;
import com.gym.training.payment.service.PaymentRequester;
import com.gym.training.payment.service.PixPaymentService;
import jakarta.validation.Valid;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments/pix")
public class PaymentController {

    private static final Logger LOGGER = LoggerFactory.getLogger(PaymentController.class);

    private final PixPaymentService pixPaymentService;

    @Value("${confrapix.webhook.secret:}")
    private String webhookSecret;

    public PaymentController(PixPaymentService pixPaymentService) {
        this.pixPaymentService = pixPaymentService;
    }

    @PostMapping("/transactions")
    public ResponseEntity<JsonNode> storeTransaction(
            @Valid @RequestBody StorePixTransactionRequest request,
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @RequestHeader(value = "X-User-Full-Name", required = false) String fullName,
            @RequestHeader(value = "X-Plan-Name", required = false) String planName
    ) {
        PaymentRequester requester = new PaymentRequester(parseUuid(userId), email, fullName, planName);
        return ResponseEntity.ok(pixPaymentService.storeTransaction(request, requester));
    }

    @GetMapping("/transactions/{transactionId}")
    public ResponseEntity<JsonNode> showTransaction(@PathVariable String transactionId) {
        return ResponseEntity.ok(pixPaymentService.showTransaction(transactionId));
    }

    @GetMapping("/confrapix/version")
    public ResponseEntity<JsonNode> version() {
        return ResponseEntity.ok(pixPaymentService.version());
    }

    @PostMapping("/webhook")
    public ResponseEntity<Void> callbackTransaction(
            @RequestBody JsonNode payload,
            @RequestParam(value = "token", required = false) String token
    ) {
        if (!isWebhookAuthorized(token)) {
            LOGGER.warn("Callback Confrapix rejeitado: token invalido.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        pixPaymentService.handleTransactionCallback(payload);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    private boolean isWebhookAuthorized(String token) {
        // Sem secret configurado (ex.: dev local), nao exige token.
        if (!StringUtils.hasText(webhookSecret)) {
            return true;
        }
        return webhookSecret.equals(token);
    }

    private static UUID parseUuid(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        try {
            return UUID.fromString(value);
        } catch (IllegalArgumentException exception) {
            return null;
        }
    }
}

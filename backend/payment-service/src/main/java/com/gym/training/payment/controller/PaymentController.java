package com.gym.training.payment.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.gym.training.payment.controller.request.StorePixTransactionRequest;
import com.gym.training.payment.service.PixPaymentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments/pix")
public class PaymentController {

    private final PixPaymentService pixPaymentService;

    public PaymentController(PixPaymentService pixPaymentService) {
        this.pixPaymentService = pixPaymentService;
    }

    @PostMapping("/transactions")
    public ResponseEntity<JsonNode> storeTransaction(@Valid @RequestBody StorePixTransactionRequest request) {
        return ResponseEntity.ok(pixPaymentService.storeTransaction(request));
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
    public ResponseEntity<Void> callbackTransaction(@RequestBody JsonNode payload) {
        pixPaymentService.handleTransactionCallback(payload);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}

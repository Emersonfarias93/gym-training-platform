package com.gym.training.payment.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.gym.training.payment.controller.request.StorePixTransactionRequest;
import com.gym.training.payment.service.PixPaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
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
}

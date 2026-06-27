package com.gym.training.payment.controller;

import com.gym.training.payment.controller.response.PaymentAccessStatusResponse;
import com.gym.training.payment.service.PremiumAccessService;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/payments/access")
public class PaymentAccessController {

    private static final String USER_ID_HEADER = "X-User-Id";

    private final PremiumAccessService premiumAccessService;

    public PaymentAccessController(PremiumAccessService premiumAccessService) {
        this.premiumAccessService = premiumAccessService;
    }

    @GetMapping("/me")
    @ResponseStatus(HttpStatus.OK)
    public PaymentAccessStatusResponse getMyAccess(
            @RequestHeader(USER_ID_HEADER) String userId
    ) {
        return premiumAccessService.getAccessStatus(parseUserId(userId));
    }

    private UUID parseUserId(String value) {
        if (!StringUtils.hasText(value)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Usuario nao informado.");
        }
        try {
            return UUID.fromString(value);
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Usuario invalido.");
        }
    }
}

package com.gym.training.payment.service;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.gym.training.payment.client.ConfrapixTransactionClient;
import com.gym.training.payment.config.ConfrapixProperties;
import com.gym.training.payment.domain.PixTransaction;
import com.gym.training.payment.controller.request.StorePixTransactionRequest;
import java.math.BigDecimal;
import java.util.UUID;
import org.springframework.web.server.ResponseStatusException;
import com.gym.training.payment.event.PaymentEventPublisher;
import com.gym.training.payment.repository.PixTransactionRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PixPaymentServiceTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Mock
    private ConfrapixTransactionClient confrapixTransactionClient;

    @Mock
    private ConfrapixProperties properties;

    @Mock
    private PixTransactionRepository repository;

    @Mock
    private PaymentEventPublisher publisher;

    @Mock
    private PremiumAccessService premiumAccessService;

    @InjectMocks
    private PixPaymentService service;

    private JsonNode callback(String uuid, String status, boolean confirmed) {
        ObjectNode node = objectMapper.createObjectNode();
        node.put("uuid", uuid);
        node.put("status", status);
        node.put("confirmed", confirmed);
        return node;
    }

    @Test
    void confirmaEPublicaUmaVez() {
        PixTransaction transaction = new PixTransaction();
        transaction.setConfrapixUuid("u1");
        transaction.setProcessed(false);
        when(repository.findByConfrapixUuid("u1")).thenReturn(Optional.of(transaction));

        service.handleTransactionCallback(callback("u1", "succeeded", true));

        assertTrue(transaction.isProcessed());
        verify(repository).save(transaction);
        verify(premiumAccessService).grantMonthlyAccess(transaction);
        verify(publisher).publishPaymentConfirmed(transaction);
    }

    @Test
    void naoRepublicaQuandoJaProcessada() {
        PixTransaction transaction = new PixTransaction();
        transaction.setConfrapixUuid("u1");
        transaction.setProcessed(true);
        when(repository.findByConfrapixUuid("u1")).thenReturn(Optional.of(transaction));

        service.handleTransactionCallback(callback("u1", "succeeded", true));

        verify(repository, never()).save(any());
        verify(premiumAccessService, never()).grantMonthlyAccess(any());
        verify(publisher, never()).publishPaymentConfirmed(any());
    }

    @Test
    void ignoraTransacaoDesconhecida() {
        when(repository.findByConfrapixUuid("ghost")).thenReturn(Optional.empty());

        service.handleTransactionCallback(callback("ghost", "succeeded", true));

        verify(publisher, never()).publishPaymentConfirmed(any());
    }

    @Test
    void doesNotExposeAnotherUsersTransaction() {
        var error = assertThrows(ResponseStatusException.class,
                () -> service.showTransaction("someone-elses-transaction", UUID.randomUUID()));
        assertEquals(404, error.getStatusCode().value());
        verify(confrapixTransactionClient, never()).show(any());
    }

    @Test
    void priceAndCallbackAreControlledByServer() {
        var request = new StorePixTransactionRequest();
        request.setAmount(new BigDecimal("0.01"));
        request.setCallbackUrl("https://untrusted.example/callback");
        when(properties.callbackUrl()).thenReturn("https://configured.example/callback");
        when(confrapixTransactionClient.store(any())).thenReturn(objectMapper.createObjectNode());
        service.storeTransaction(request, new PaymentRequester(UUID.randomUUID(), "user@example.com", "Aluno", "FitAI Premium"));
        assertEquals(new BigDecimal("1.00"), request.getAmount());
        assertEquals("https://configured.example/callback", request.getCallbackUrl());
    }
}

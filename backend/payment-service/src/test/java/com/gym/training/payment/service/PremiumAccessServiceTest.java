package com.gym.training.payment.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.gym.training.payment.domain.PixTransaction;
import com.gym.training.payment.domain.PremiumAccessGrant;
import com.gym.training.payment.domain.PremiumAccessStatus;
import com.gym.training.payment.repository.PixTransactionRepository;
import com.gym.training.payment.repository.PremiumAccessGrantRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PremiumAccessServiceTest {

    @Mock
    private PremiumAccessGrantRepository premiumAccessGrantRepository;

    @Mock
    private PixTransactionRepository pixTransactionRepository;

    @InjectMocks
    private PremiumAccessService service;

    @Test
    void concedeAcessoMensalParaPagamentoConfirmado() {
        UUID userId = UUID.randomUUID();
        PixTransaction transaction = transaction(userId, "tx-1");
        when(premiumAccessGrantRepository.findByAuthUserId(userId)).thenReturn(Optional.empty());
        when(premiumAccessGrantRepository.save(any(PremiumAccessGrant.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        PremiumAccessGrant grant = service.grantMonthlyAccess(transaction);

        assertEquals(userId, grant.getAuthUserId());
        assertEquals(PremiumAccessStatus.ACTIVE, grant.getStatus());
        assertEquals("FitAI Premium", grant.getPlanName());
        assertEquals("tx-1", grant.getLastPaymentTransactionUuid());
        assertNotNull(grant.getExpiresAt());
    }

    @Test
    void restauraStatusAPartirDePixProcessadoQuandoGrantNaoExiste() {
        UUID userId = UUID.randomUUID();
        PixTransaction transaction = transaction(userId, "tx-2");
        transaction.setPaidAt(Instant.now());
        when(premiumAccessGrantRepository.findByAuthUserId(userId)).thenReturn(Optional.empty());
        when(pixTransactionRepository.findTopByAuthUserIdAndProcessedTrueOrderByPaidAtDescCreatedAtDesc(userId))
                .thenReturn(Optional.of(transaction));
        when(premiumAccessGrantRepository.save(any(PremiumAccessGrant.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        var response = service.getAccessStatus(userId);

        assertTrue(response.premiumActive());
        assertEquals(PremiumAccessStatus.ACTIVE, response.status());
        assertEquals("FitAI Premium", response.planName());
        assertEquals("tx-2", response.lastPaymentTransactionUuid());
    }

    private PixTransaction transaction(UUID userId, String transactionUuid) {
        PixTransaction transaction = new PixTransaction();
        transaction.setId(UUID.randomUUID());
        transaction.setAuthUserId(userId);
        transaction.setConfrapixUuid(transactionUuid);
        transaction.setPlanName("FitAI Premium");
        transaction.setAmount(BigDecimal.valueOf(29.90));
        transaction.setStatus("succeeded");
        transaction.setProcessed(true);
        return transaction;
    }
}

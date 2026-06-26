package com.gym.training.user.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.gym.training.user.domain.PremiumStatus;
import com.gym.training.user.domain.UserPremiumSnapshot;
import com.gym.training.user.repository.UserPremiumSnapshotRepository;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class UserPremiumServiceTest {

    @Mock
    private UserProfileService userProfileService;

    @Mock
    private UserPremiumSnapshotRepository repository;

    @InjectMocks
    private UserPremiumService service;

    @Test
    void ativaQuandoNaoPremium() {
        UUID userId = UUID.randomUUID();
        UserPremiumSnapshot snapshot = UserPremiumSnapshot.builder()
                .premiumActive(false)
                .status(PremiumStatus.NONE)
                .build();
        when(repository.findByUserProfileAuthUserId(userId)).thenReturn(Optional.of(snapshot));

        service.activatePremium(userId, "a@b.com", "Nome Sobrenome", "FitAI Premium");

        assertTrue(snapshot.isPremiumActive());
        assertEquals(PremiumStatus.ACTIVE, snapshot.getStatus());
        assertEquals("FitAI Premium", snapshot.getPlanName());
        verify(repository).save(snapshot);
    }

    @Test
    void idempotenteQuandoJaAtivo() {
        UUID userId = UUID.randomUUID();
        UserPremiumSnapshot snapshot = UserPremiumSnapshot.builder()
                .premiumActive(true)
                .status(PremiumStatus.ACTIVE)
                .build();
        when(repository.findByUserProfileAuthUserId(userId)).thenReturn(Optional.of(snapshot));

        service.activatePremium(userId, "a@b.com", "Nome Sobrenome", "FitAI Premium");

        verify(repository, never()).save(snapshot);
    }
}

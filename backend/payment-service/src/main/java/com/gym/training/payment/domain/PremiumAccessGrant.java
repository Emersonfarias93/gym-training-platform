package com.gym.training.payment.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

/**
 * Estado persistido de acesso premium gerado por pagamentos confirmados.
 * Este registro e a fonte confiavel para reconciliar sessoes e snapshots.
 */
@Entity
@Table(name = "premium_access_grants")
public class PremiumAccessGrant {

    @Id
    private UUID id;

    @Column(nullable = false, unique = true)
    private UUID authUserId;

    @Column(length = 80)
    private String planName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PremiumAccessStatus status = PremiumAccessStatus.NONE;

    @Column(length = 80)
    private String lastPaymentTransactionUuid;

    private Instant startsAt;

    private Instant expiresAt;

    @Column(nullable = false)
    private Instant lastSyncedAt;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    void prePersist() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
        if (lastSyncedAt == null) {
            lastSyncedAt = now;
        }
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getAuthUserId() {
        return authUserId;
    }

    public void setAuthUserId(UUID authUserId) {
        this.authUserId = authUserId;
    }

    public String getPlanName() {
        return planName;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
    }

    public PremiumAccessStatus getStatus() {
        return status;
    }

    public void setStatus(PremiumAccessStatus status) {
        this.status = status;
    }

    public String getLastPaymentTransactionUuid() {
        return lastPaymentTransactionUuid;
    }

    public void setLastPaymentTransactionUuid(String lastPaymentTransactionUuid) {
        this.lastPaymentTransactionUuid = lastPaymentTransactionUuid;
    }

    public Instant getStartsAt() {
        return startsAt;
    }

    public void setStartsAt(Instant startsAt) {
        this.startsAt = startsAt;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public Instant getLastSyncedAt() {
        return lastSyncedAt;
    }

    public void setLastSyncedAt(Instant lastSyncedAt) {
        this.lastSyncedAt = lastSyncedAt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}

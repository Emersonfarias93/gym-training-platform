package com.gym.training.payment.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Mapeia uma cobranca Pix criada na Confrapix ao usuario que a originou.
 * Necessario porque o callback da Confrapix nao traz o nosso userId; aqui
 * guardamos a correlacao para, no webhook, saber quem ativar como premium.
 */
@Entity
@Table(name = "pix_transactions")
public class PixTransaction {

    @Id
    private UUID id;

    @Column(nullable = false, unique = true, length = 80)
    private String confrapixUuid;

    @Column(length = 40)
    private String confrapixTransactionId;

    @Column(nullable = false)
    private UUID authUserId;

    @Column(length = 150)
    private String userEmail;

    @Column(length = 120)
    private String userFullName;

    @Column(length = 80)
    private String planName;

    @Column(precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 30)
    private String status;

    @Column(nullable = false)
    private boolean processed = false;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    private Instant paidAt;

    @PrePersist
    void prePersist() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
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

    public String getConfrapixUuid() {
        return confrapixUuid;
    }

    public void setConfrapixUuid(String confrapixUuid) {
        this.confrapixUuid = confrapixUuid;
    }

    public String getConfrapixTransactionId() {
        return confrapixTransactionId;
    }

    public void setConfrapixTransactionId(String confrapixTransactionId) {
        this.confrapixTransactionId = confrapixTransactionId;
    }

    public UUID getAuthUserId() {
        return authUserId;
    }

    public void setAuthUserId(UUID authUserId) {
        this.authUserId = authUserId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserFullName() {
        return userFullName;
    }

    public void setUserFullName(String userFullName) {
        this.userFullName = userFullName;
    }

    public String getPlanName() {
        return planName;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isProcessed() {
        return processed;
    }

    public void setProcessed(boolean processed) {
        this.processed = processed;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public Instant getPaidAt() {
        return paidAt;
    }

    public void setPaidAt(Instant paidAt) {
        this.paidAt = paidAt;
    }
}

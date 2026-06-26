package com.gym.training.user.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_preferences")
public class UserPreferences {

    @Id
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_profile_id", nullable = false, unique = true)
    private UserProfile userProfile;

    @Builder.Default
    @Column(nullable = false, length = 10)
    private String language = "pt-BR";

    @Builder.Default
    @Column(nullable = false, length = 60)
    private String timezone = "America/Sao_Paulo";

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MeasurementSystem measurementSystem = MeasurementSystem.METRIC;

    @Builder.Default
    @Column(nullable = false)
    private boolean notificationsEnabled = true;

    @Builder.Default
    @Column(nullable = false)
    private boolean emailNotificationsEnabled = true;

    @Builder.Default
    @Column(nullable = false)
    private boolean pushNotificationsEnabled = false;

    @Builder.Default
    @Column(nullable = false)
    private boolean aiCoachPersonalizationEnabled = true;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

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
}

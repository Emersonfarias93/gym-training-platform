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
import java.math.BigDecimal;
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
@Table(name = "user_fitness_contexts")
public class UserFitnessContext {

    @Id
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_profile_id", nullable = false, unique = true)
    private UserProfile userProfile;

    @Enumerated(EnumType.STRING)
    @Column(length = 40)
    private FitnessGoal mainGoal;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private TrainingExperienceLevel experienceLevel;

    @Column(precision = 5, scale = 2)
    private BigDecimal heightCm;

    @Column(precision = 5, scale = 2)
    private BigDecimal weightKg;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private ActivityLevel activityLevel;

    private Integer trainingFrequencyPerWeek;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private PreferredTrainingTime preferredTrainingTime;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private DietaryPreference dietaryPreference;

    @Column(length = 1000)
    private String foodRestrictions;

    @Column(length = 1000)
    private String injuryNotes;

    @Column(length = 1000)
    private String medicalNotes;

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

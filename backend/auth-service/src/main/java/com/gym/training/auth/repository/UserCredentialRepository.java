package com.gym.training.auth.repository;

import com.gym.training.auth.domain.UserCredential;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserCredentialRepository extends JpaRepository<UserCredential, UUID> {

    boolean existsByEmailIgnoreCase(String email);

    Optional<UserCredential> findByEmailIgnoreCase(String email);
}

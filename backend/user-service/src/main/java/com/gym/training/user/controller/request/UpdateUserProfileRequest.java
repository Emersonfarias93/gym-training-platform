package com.gym.training.user.controller.request;

import com.gym.training.user.domain.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record UpdateUserProfileRequest(
        @Size(min = 3, max = 120, message = "O nome deve ter entre 3 e 120 caracteres")
        String fullName,

        @Email(message = "Informe um email valido")
        @Size(max = 150, message = "O email deve ter no maximo 150 caracteres")
        String email,

        @Size(max = 30, message = "O telefone deve ter no maximo 30 caracteres")
        String phone,

        LocalDate birthDate,

        Gender gender
) {
}

package com.gym.training.payment.controller;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import com.gym.training.payment.service.PixPaymentService;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

class PaymentControllerTest {
    @Test
    void rejectsWebhookWhenSecretIsAbsentOrIncorrect() throws Exception {
        var service = mock(PixPaymentService.class);
        var controller = new PaymentController(service);
        var mvc = MockMvcBuilders.standaloneSetup(controller).build();
        for (String secret : new String[]{"", "configured-secret"}) {
            ReflectionTestUtils.setField(controller, "webhookSecret", secret);
            mvc.perform(post("/api/payments/pix/webhook").contentType(MediaType.APPLICATION_JSON)
                    .param("token", "wrong").content("{}")).andExpect(status().isUnauthorized());
        }
        verifyNoInteractions(service);
    }

    @Test
    void acceptsAuthenticatedCallback() throws Exception {
        var service = mock(PixPaymentService.class);
        var controller = new PaymentController(service);
        ReflectionTestUtils.setField(controller, "webhookSecret", "configured-secret");
        var mvc = MockMvcBuilders.standaloneSetup(controller).build();
        mvc.perform(post("/api/payments/pix/webhook").contentType(MediaType.APPLICATION_JSON)
                .param("token", "configured-secret").content("{}")).andExpect(status().isNoContent());
        verify(service).handleTransactionCallback(org.mockito.ArgumentMatchers.any());
    }
}

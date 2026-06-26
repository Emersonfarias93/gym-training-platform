package com.gym.training.workout.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Component
public class UserContextClient {

    private final RestClient restClient;

    public UserContextClient(
            RestClient.Builder builder,
            @Value("${fitai.services.user-service-url}") String userServiceUrl
    ) {
        this.restClient = builder.baseUrl(userServiceUrl).build();
    }

    public UserAiCoachContext getAiCoachContext(AuthenticatedUser user) {
        try {
            UserAiCoachContext response = restClient.get()
                    .uri("/api/v1/users/me/ai-coach-context")
                    .header("X-User-Id", user.userId().toString())
                    .header("X-User-Email", user.email())
                    .header("X-User-Full-Name", user.fullName())
                    .retrieve()
                    .body(UserAiCoachContext.class);

            return response == null ? UserAiCoachContext.empty(user) : response;
        } catch (RestClientException exception) {
            return UserAiCoachContext.empty(user);
        }
    }
}

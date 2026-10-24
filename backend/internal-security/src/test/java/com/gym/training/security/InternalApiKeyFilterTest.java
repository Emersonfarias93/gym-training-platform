package com.gym.training.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

class InternalApiKeyFilterTest {
    private MockHttpServletRequest request(String key) {
        var request = new MockHttpServletRequest("GET", "/api/v1/users/me/profile");
        request.setServletPath("/api/v1/users/me/profile");
        request.addHeader("X-User-Id", "forged-user");
        if (key != null) request.addHeader("X-Internal-Api-Key", key);
        return request;
    }

    @Test
    void rejectsForgedIdentityWithoutInternalKey() throws Exception {
        var response = new MockHttpServletResponse();
        new InternalApiKeyFilter("server-secret").doFilter(request(null), response,
                (req, res) -> { throw new AssertionError("Untrusted request reached controller"); });
        assertEquals(401, response.getStatus());
    }

    @Test
    void rejectsMissingConfigurationAndIncorrectKey() throws Exception {
        for (String configured : new String[]{"", "other-secret"}) {
            var response = new MockHttpServletResponse();
            new InternalApiKeyFilter(configured).doFilter(request("server-secret"), response,
                    (req, res) -> { throw new AssertionError("Invalid key accepted"); });
            assertEquals(401, response.getStatus());
        }
    }

    @Test
    void acceptsTrustedServer() throws Exception {
        var response = new MockHttpServletResponse();
        new InternalApiKeyFilter("server-secret").doFilter(request("server-secret"), response,
                (req, res) -> res.setContentType("application/json"));
        assertEquals("application/json", response.getContentType());
    }

    @Test
    void leavesWebhookAuthenticationToController() throws Exception {
        var request = request(null);
        request.setServletPath("/api/payments/pix/webhook");
        var response = new MockHttpServletResponse();
        new InternalApiKeyFilter("").doFilter(request, response,
                (req, res) -> res.setContentType("application/json"));
        assertEquals("application/json", response.getContentType());
    }
}

package com.gym.training.llm.service;

import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.stereotype.Service;

@Service
public class LlmService {

    private final OpenAiChatModel chatModel;

    public LlmService(OpenAiChatModel chatModel) {
        this.chatModel = chatModel;
    }

    public String generate(String prompt) {
        return chatModel.call(prompt);
    }
}

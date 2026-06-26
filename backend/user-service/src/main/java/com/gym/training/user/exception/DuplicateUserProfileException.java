package com.gym.training.user.exception;

public class DuplicateUserProfileException extends RuntimeException {

    public DuplicateUserProfileException(String message) {
        super(message);
    }
}

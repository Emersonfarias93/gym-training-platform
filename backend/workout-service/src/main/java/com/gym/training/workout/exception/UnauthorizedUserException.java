package com.gym.training.workout.exception;

public class UnauthorizedUserException extends RuntimeException {

    public UnauthorizedUserException(String message) {
        super(message);
    }
}

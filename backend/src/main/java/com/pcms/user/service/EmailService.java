package com.pcms.user.service;

public interface EmailService {

    void sendPasswordResetOtp(
            String recipientEmail,
            String otp
    );
}
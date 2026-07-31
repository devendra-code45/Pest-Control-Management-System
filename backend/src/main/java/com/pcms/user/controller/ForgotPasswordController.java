package com.pcms.user.controller;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.pcms.user.dto.ForgotPasswordRequest;
import com.pcms.user.dto.VerifyOtpRequest;
import com.pcms.user.dto.ResetPasswordRequest;
import com.pcms.user.service.ForgotPasswordService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
@Validated
public class ForgotPasswordController {

    private final ForgotPasswordService forgotPasswordService;

    public ForgotPasswordController(
            ForgotPasswordService forgotPasswordService) {

        this.forgotPasswordService = forgotPasswordService;
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @Valid
            @RequestBody
            ForgotPasswordRequest request) {

        forgotPasswordService.sendOtp(request);

        return ResponseEntity.ok(
                "OTP sent successfully."
        );
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request) {

        forgotPasswordService.verifyOtp(request);

        return ResponseEntity.ok(
                "OTP verified successfully."
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        forgotPasswordService.resetPassword(request);

        return ResponseEntity.ok(
                "Password reset successfully."
        );
    }
}
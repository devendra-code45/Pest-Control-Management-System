package com.pcms.user.service.impl;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.pcms.user.dto.ForgotPasswordRequest;
import com.pcms.user.dto.ResetPasswordRequest;
import com.pcms.user.dto.VerifyOtpRequest;
import com.pcms.user.entity.PasswordResetOtp;
import com.pcms.user.entity.User;
import com.pcms.user.repository.PasswordResetOtpRepository;
import com.pcms.user.repository.UserRepository;
import com.pcms.user.service.EmailService;
import com.pcms.user.service.ForgotPasswordService;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ForgotPasswordServiceImpl
        implements ForgotPasswordService {

    private final UserRepository userRepository;

    private final PasswordResetOtpRepository otpRepository;

    private final EmailService emailService;

    private final PasswordEncoder passwordEncoder;

    public ForgotPasswordServiceImpl(
            UserRepository userRepository,
            PasswordResetOtpRepository otpRepository,
            EmailService emailService,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void sendOtp(
            ForgotPasswordRequest request) {

        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found."
                        ));

        otpRepository.deleteByEmail(email);

        String otp = String.format(
                "%06d",
                new Random().nextInt(999999)
        );

        PasswordResetOtp passwordResetOtp =
                PasswordResetOtp.builder()
                        .email(email)
                        .otp(otp)
                        .verified(false)
                        .expiryTime(
                                LocalDateTime.now()
                                        .plusMinutes(10)
                        )
                        .build();

        otpRepository.save(passwordResetOtp);

        emailService.sendPasswordResetOtp(
                email,
                otp
        );
    }

    @Override
    public void verifyOtp(
            VerifyOtpRequest request) {

        PasswordResetOtp otp =
                otpRepository.findByEmailAndOtp(
                                request.getEmail()
                                        .trim()
                                        .toLowerCase(),
                                request.getOtp()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid OTP."
                                ));

        if (otp.getExpiryTime()
                .isBefore(LocalDateTime.now())) {

            throw new RuntimeException(
                    "OTP has expired."
            );
        }

        otp.setVerified(true);

        otpRepository.save(otp);
    }
    
    

    @Override
    @Transactional
    public void resetPassword(
            ResetPasswordRequest request) {

        if (!request.getNewPassword()
                .equals(request.getConfirmPassword())) {

            throw new RuntimeException(
                    "Passwords do not match."
            );
        }

        PasswordResetOtp otp =
                otpRepository.findByEmailAndOtp(
                                request.getEmail()
                                        .trim()
                                        .toLowerCase(),
                                request.getOtp()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid OTP."
                                ));

        if (!otp.isVerified()) {

            throw new RuntimeException(
                    "OTP not verified."
            );
        }

        if (otp.getExpiryTime()
                .isBefore(LocalDateTime.now())) {

            throw new RuntimeException(
                    "OTP has expired."
            );
        }

        User user =
                userRepository.findByEmail(
                                request.getEmail()
                                        .trim()
                                        .toLowerCase()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found."
                                ));

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        userRepository.save(user);

        otpRepository.deleteByEmail(
                user.getEmail()
        );
    }
}
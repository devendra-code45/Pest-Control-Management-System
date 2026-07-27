package com.pcms.user.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pcms.user.entity.PasswordResetOtp;

@Repository
public interface PasswordResetOtpRepository
        extends JpaRepository<PasswordResetOtp, Long> {

    Optional<PasswordResetOtp>
            findTopByEmailOrderByCreatedAtDesc(String email);

    Optional<PasswordResetOtp>
            findByEmailAndOtp(String email, String otp);

    void deleteByEmail(String email);
}
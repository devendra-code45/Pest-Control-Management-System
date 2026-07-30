package com.pcms.payment.dto;

import com.pcms.payment.entity.PaymentVerificationStatus;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyBankTransferRequest {

    @NotNull(message = "Verification status is required")
    private PaymentVerificationStatus verificationStatus;

    @Size(
            max = 500,
            message = "Verification note cannot exceed 500 characters"
    )
    private String verificationNote;
}

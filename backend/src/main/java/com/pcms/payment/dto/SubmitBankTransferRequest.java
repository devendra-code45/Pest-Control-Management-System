package com.pcms.payment.dto;

import java.math.BigDecimal;

import com.pcms.payment.entity.PaymentPurpose;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubmitBankTransferRequest {

    @NotNull(message = "Booking ID is required")
    private Long bookingId;

    @NotNull(message = "Payment purpose is required")
    private PaymentPurpose purpose;

    @NotNull(message = "Payment amount is required")
    @DecimalMin(
            value = "1.00",
            inclusive = true,
            message = "Payment amount must be at least 1.00"
    )
    @Digits(
            integer = 10,
            fraction = 2,
            message = "Payment amount can contain up to 10 integer digits and 2 decimal places"
    )
    private BigDecimal amount;

    @NotBlank(message = "UTR or bank reference number is required")
    @Pattern(
            regexp = "^[A-Za-z0-9]{6,35}$",
            message = "UTR or bank reference number must contain 6 to 35 letters or digits"
    )
    private String utrNumber;

    @NotBlank(message = "Payment screenshot reference is required")
    @Size(
            max = 500,
            message = "Payment screenshot reference cannot exceed 500 characters"
    )
    private String proofObjectKey;
}

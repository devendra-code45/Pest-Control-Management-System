package com.pcms.payment.dto;

import java.math.BigDecimal;

import com.pcms.payment.entity.PaymentMethod;
import com.pcms.payment.entity.PaymentPurpose;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateOnlinePaymentRequest {

    @NotNull(message = "Booking ID is required")
    private Long bookingId;

    @NotNull(message = "Payment purpose is required")
    private PaymentPurpose purpose;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

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
}

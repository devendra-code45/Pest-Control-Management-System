package com.pcms.payment.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreatePaymentScheduleRequest {

    @NotNull(message = "Booking ID is required")
    private Long bookingId;

    @DecimalMin(
            value = "0.00",
            inclusive = true,
            message = "Required advance amount cannot be negative"
    )
    @Digits(
            integer = 10,
            fraction = 2,
            message = "Required advance amount can contain up to 10 integer digits and 2 decimal places"
    )
    private BigDecimal requiredAdvanceAmount;

    @NotNull(message = "Payment due date is required")
    @FutureOrPresent(message = "Payment due date cannot be in the past")
    private LocalDate paymentDueDate;
}

package com.pcms.payment.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GenerateInvoiceRequest {

    @NotNull(message = "Booking ID is required")
    private Long bookingId;
}

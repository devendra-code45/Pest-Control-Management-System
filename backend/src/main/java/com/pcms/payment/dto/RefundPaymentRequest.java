package com.pcms.payment.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class RefundPaymentRequest {

    @NotNull(message = "Refund amount is required")
    @DecimalMin(
            value = "0.01",
            message = "Refund amount must be greater than zero"
    )
    private BigDecimal amount;

    @NotBlank(message = "Refund reason is required")
    @Size(
            max = 150,
            message = "Refund reason cannot exceed 150 characters"
    )
    private String reason;

    @Size(
            max = 500,
            message = "Refund note cannot exceed 500 characters"
    )
    private String note;

    public RefundPaymentRequest() {
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
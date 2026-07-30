package com.pcms.payment.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.pcms.payment.entity.PaymentScheduleStatus;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PaymentScheduleResponse {

    private Long id;

    private Long bookingId;

    private Long customerId;

    private String customerName;

    private BigDecimal totalAmount;

    private BigDecimal requiredAdvanceAmount;

    private BigDecimal paidAmount;

    private BigDecimal remainingAmount;

    private String currency;

    private LocalDate paymentDueDate;

    private PaymentScheduleStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}

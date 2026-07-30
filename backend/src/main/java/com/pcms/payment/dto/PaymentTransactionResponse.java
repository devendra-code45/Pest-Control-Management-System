package com.pcms.payment.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.pcms.payment.entity.PaymentMethod;
import com.pcms.payment.entity.PaymentPurpose;
import com.pcms.payment.entity.PaymentStatus;
import com.pcms.payment.entity.PaymentVerificationStatus;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PaymentTransactionResponse {

    private Long id;

    private String transactionId;

    private Long paymentScheduleId;

    private Long bookingId;

    private Long customerId;

    private String customerName;

    private BigDecimal amount;

    private String currency;

    private PaymentPurpose purpose;

    private PaymentMethod paymentMethod;

    private PaymentStatus status;

    private PaymentVerificationStatus verificationStatus;

    private String gatewayProvider;

    private String providerOrderId;

    private String providerPaymentId;

    private String utrNumber;

    private boolean bankTransferProofAvailable;

    private Long verifiedByUserId;

    private String verifiedByName;

    private LocalDateTime verifiedAt;

    private String verificationNote;

    private String failureCode;

    private String failureReason;

    private BigDecimal refundedAmount;

    private LocalDateTime paidAt;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}

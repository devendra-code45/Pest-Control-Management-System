package com.pcms.payment.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.pcms.user.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
        name = "payment_transactions",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_payment_transaction_public_id",
                        columnNames = "transaction_id"
                ),
                @UniqueConstraint(
                        name = "uk_payment_transaction_idempotency",
                        columnNames = "idempotency_key"
                ),
                @UniqueConstraint(
                        name = "uk_payment_transaction_provider_payment",
                        columnNames = {
                                "gateway_provider",
                                "provider_payment_id"
                        }
                ),
                @UniqueConstraint(
                        name = "uk_payment_transaction_utr",
                        columnNames = "utr_number"
                )
        },
        indexes = {
                @Index(
                        name = "idx_payment_transaction_schedule",
                        columnList = "payment_schedule_id"
                ),
                @Index(
                        name = "idx_payment_transaction_status_created",
                        columnList = "status,created_at"
                ),
                @Index(
                        name = "idx_payment_transaction_provider_order",
                        columnList = "gateway_provider,provider_order_id"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            name = "transaction_id",
            nullable = false,
            updatable = false,
            length = 40
    )
    private String transactionId;

    @Column(
            name = "idempotency_key",
            nullable = false,
            updatable = false,
            length = 100
    )
    private String idempotencyKey;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "payment_schedule_id",
            nullable = false
    )
    private PaymentSchedule paymentSchedule;

    @Column(
            nullable = false,
            precision = 12,
            scale = 2
    )
    private BigDecimal amount;

    @Column(
            nullable = false,
            length = 3
    )
    @Builder.Default
    private String currency = "INR";

    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false,
            length = 20
    )
    private PaymentPurpose purpose;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "payment_method",
            nullable = false,
            length = 30
    )
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false,
            length = 30
    )
    private PaymentStatus status;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "verification_status",
            nullable = false,
            length = 30
    )
    private PaymentVerificationStatus verificationStatus;

    @Column(
            name = "gateway_provider",
            length = 50
    )
    private String gatewayProvider;

    @Column(
            name = "provider_order_id",
            length = 100
    )
    private String providerOrderId;

    @Column(
            name = "provider_payment_id",
            length = 100
    )
    private String providerPaymentId;

    @Column(
            name = "utr_number",
            length = 35
    )
    private String utrNumber;

    @Column(
            name = "proof_object_key",
            length = 500
    )
    private String proofObjectKey;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "verified_by_user_id")
    private User verifiedBy;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(
            name = "verification_note",
            length = 500
    )
    private String verificationNote;

    @Column(
            name = "failure_code",
            length = 100
    )
    private String failureCode;

    @Column(
            name = "failure_reason",
            length = 500
    )
    private String failureReason;

    @Column(
            name = "refunded_amount",
            nullable = false,
            precision = 12,
            scale = 2
    )
    @Builder.Default
    private BigDecimal refundedAmount = BigDecimal.ZERO;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Version
    private Long version;

    @Column(
            name = "created_at",
            nullable = false,
            updatable = false
    )
    private LocalDateTime createdAt;

    @Column(
            name = "updated_at",
            nullable = false
    )
    private LocalDateTime updatedAt;

    @PrePersist
    public void beforeInsert() {
        LocalDateTime now = LocalDateTime.now();

        createdAt = now;
        updatedAt = now;

        if (transactionId == null || transactionId.isBlank()) {
            transactionId = "TXN-"
                    + UUID.randomUUID()
                            .toString()
                            .replace("-", "")
                            .toUpperCase();
        }

        if (currency == null || currency.isBlank()) {
            currency = "INR";
        }

        if (amount == null || amount.signum() <= 0) {
            throw new IllegalStateException(
                    "Payment transaction amount must be greater than zero"
            );
        }

        if (refundedAmount == null) {
            refundedAmount = BigDecimal.ZERO;
        }

        if (refundedAmount.signum() < 0
                || refundedAmount.compareTo(amount) > 0) {
            throw new IllegalStateException(
                    "Refunded amount must be between zero and the transaction amount"
            );
        }

        if (status == null) {
            status = paymentMethod == PaymentMethod.BANK_TRANSFER
                    ? PaymentStatus.PENDING_VERIFICATION
                    : PaymentStatus.CREATED;
        }

        if (verificationStatus == null) {
            verificationStatus = paymentMethod == PaymentMethod.BANK_TRANSFER
                    ? PaymentVerificationStatus.PENDING
                    : PaymentVerificationStatus.NOT_REQUIRED;
        }
    }

    @PreUpdate
    public void beforeUpdate() {
        updatedAt = LocalDateTime.now();

        if (refundedAmount == null
                || refundedAmount.signum() < 0
                || refundedAmount.compareTo(amount) > 0) {
            throw new IllegalStateException(
                    "Refunded amount must be between zero and the transaction amount"
            );
        }
    }
}

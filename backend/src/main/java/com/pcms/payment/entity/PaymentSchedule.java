package com.pcms.payment.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.pcms.booking.entity.Booking;
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
import jakarta.persistence.OneToOne;
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
        name = "payment_schedules",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_payment_schedule_booking",
                        columnNames = "booking_id"
                )
        },
        indexes = {
                @Index(
                        name = "idx_payment_schedule_customer",
                        columnList = "customer_id"
                ),
                @Index(
                        name = "idx_payment_schedule_status_due_date",
                        columnList = "status,payment_due_date"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "booking_id",
            nullable = false,
            unique = true
    )
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "customer_id",
            nullable = false
    )
    private User customer;

    @Column(
            name = "total_amount",
            nullable = false,
            precision = 12,
            scale = 2
    )
    private BigDecimal totalAmount;

    @Column(
            name = "required_advance_amount",
            nullable = false,
            precision = 12,
            scale = 2
    )
    @Builder.Default
    private BigDecimal requiredAdvanceAmount = BigDecimal.ZERO;

    @Column(
            name = "paid_amount",
            nullable = false,
            precision = 12,
            scale = 2
    )
    @Builder.Default
    private BigDecimal paidAmount = BigDecimal.ZERO;

    @Column(
            name = "remaining_amount",
            nullable = false,
            precision = 12,
            scale = 2
    )
    private BigDecimal remainingAmount;

    @Column(
            nullable = false,
            length = 3
    )
    @Builder.Default
    private String currency = "INR";

    @Column(
            name = "payment_due_date",
            nullable = false
    )
    private LocalDate paymentDueDate;

    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false,
            length = 30
    )
    private PaymentScheduleStatus status;

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

        normalizeAmounts();

        if (currency == null || currency.isBlank()) {
            currency = "INR";
        }

        if (status == null) {
            status = calculateStatus();
        }
    }

    @PreUpdate
    public void beforeUpdate() {
        updatedAt = LocalDateTime.now();
        normalizeAmounts();

        if (status != PaymentScheduleStatus.CANCELLED
                && status != PaymentScheduleStatus.OVERDUE) {
            status = calculateStatus();
        }
    }

    private void normalizeAmounts() {
        if (totalAmount == null || totalAmount.signum() < 0) {
            throw new IllegalStateException(
                    "Payment schedule total amount must be zero or greater"
            );
        }

        if (requiredAdvanceAmount == null) {
            requiredAdvanceAmount = BigDecimal.ZERO;
        }

        if (paidAmount == null) {
            paidAmount = BigDecimal.ZERO;
        }

        if (requiredAdvanceAmount.signum() < 0
                || requiredAdvanceAmount.compareTo(totalAmount) > 0) {
            throw new IllegalStateException(
                    "Required advance amount must be between zero and the total amount"
            );
        }

        if (paidAmount.signum() < 0
                || paidAmount.compareTo(totalAmount) > 0) {
            throw new IllegalStateException(
                    "Paid amount must be between zero and the total amount"
            );
        }

        remainingAmount = totalAmount.subtract(paidAmount);
    }

    private PaymentScheduleStatus calculateStatus() {
        if (remainingAmount.signum() == 0) {
            return PaymentScheduleStatus.PAID;
        }

        if (paidAmount.signum() == 0) {
            return requiredAdvanceAmount.signum() > 0
                    ? PaymentScheduleStatus.ADVANCE_PENDING
                    : PaymentScheduleStatus.NOT_STARTED;
        }

        if (paidAmount.compareTo(requiredAdvanceAmount) >= 0) {
            return PaymentScheduleStatus.BALANCE_DUE;
        }

        return PaymentScheduleStatus.ADVANCE_PENDING;
    }
}

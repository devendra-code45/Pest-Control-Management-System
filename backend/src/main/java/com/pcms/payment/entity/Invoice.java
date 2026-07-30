package com.pcms.payment.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.pcms.booking.entity.Booking;
import com.pcms.user.entity.User;

import jakarta.persistence.CascadeType;
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
import jakarta.persistence.OneToMany;
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
        name = "invoices",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_invoice_number",
                        columnNames = "invoice_number"
                ),
                @UniqueConstraint(
                        name = "uk_invoice_booking",
                        columnNames = "booking_id"
                )
        },
        indexes = {
                @Index(
                        name = "idx_invoice_customer",
                        columnList = "customer_id"
                ),
                @Index(
                        name = "idx_invoice_status_date",
                        columnList = "status,invoice_date"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            name = "invoice_number",
            unique = true,
            length = 50
    )
    private String invoiceNumber;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "booking_id",
            nullable = false,
            unique = true
    )
    private Booking booking;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "payment_schedule_id",
            nullable = false,
            unique = true
    )
    private PaymentSchedule paymentSchedule;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "customer_id",
            nullable = false
    )
    private User customer;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "customer_billing_type",
            nullable = false,
            length = 20
    )
    private CustomerBillingType customerBillingType;

    @Column(
            name = "supplier_legal_name",
            nullable = false,
            length = 180
    )
    private String supplierLegalName;

    @Column(
            name = "supplier_gstin",
            length = 15
    )
    private String supplierGstin;

    @Column(
            name = "supplier_address",
            nullable = false,
            length = 500
    )
    private String supplierAddress;

    @Column(
            name = "supplier_state",
            nullable = false,
            length = 100
    )
    private String supplierState;

    @Column(
            name = "supplier_state_code",
            nullable = false,
            length = 2
    )
    private String supplierStateCode;

    @Column(
            name = "customer_legal_name",
            nullable = false,
            length = 180
    )
    private String customerLegalName;

    @Column(
            name = "customer_gstin",
            length = 15
    )
    private String customerGstin;

    @Column(
            name = "billing_address",
            nullable = false,
            length = 500
    )
    private String billingAddress;

    @Column(
            name = "billing_city",
            nullable = false,
            length = 100
    )
    private String billingCity;

    @Column(
            name = "billing_state",
            nullable = false,
            length = 100
    )
    private String billingState;

    @Column(
            name = "billing_state_code",
            nullable = false,
            length = 2
    )
    private String billingStateCode;

    @Column(
            name = "billing_pincode",
            nullable = false,
            length = 6
    )
    private String billingPincode;

    @Column(
            name = "place_of_supply",
            nullable = false,
            length = 100
    )
    private String placeOfSupply;

    @Column(
            name = "place_of_supply_code",
            nullable = false,
            length = 2
    )
    private String placeOfSupplyCode;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "tax_type",
            nullable = false,
            length = 20
    )
    private TaxType taxType;

    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false,
            length = 30
    )
    @Builder.Default
    private InvoiceStatus status = InvoiceStatus.DRAFT;

    @Column(
            name = "invoice_date",
            nullable = false
    )
    private LocalDate invoiceDate;

    @Column(
            name = "due_date",
            nullable = false
    )
    private LocalDate dueDate;

    @Column(
            name = "taxable_amount",
            nullable = false,
            precision = 12,
            scale = 2
    )
    @Builder.Default
    private BigDecimal taxableAmount = BigDecimal.ZERO;

    @Column(
            name = "cgst_amount",
            nullable = false,
            precision = 12,
            scale = 2
    )
    @Builder.Default
    private BigDecimal cgstAmount = BigDecimal.ZERO;

    @Column(
            name = "sgst_amount",
            nullable = false,
            precision = 12,
            scale = 2
    )
    @Builder.Default
    private BigDecimal sgstAmount = BigDecimal.ZERO;

    @Column(
            name = "igst_amount",
            nullable = false,
            precision = 12,
            scale = 2
    )
    @Builder.Default
    private BigDecimal igstAmount = BigDecimal.ZERO;

    @Column(
            name = "total_tax_amount",
            nullable = false,
            precision = 12,
            scale = 2
    )
    @Builder.Default
    private BigDecimal totalTaxAmount = BigDecimal.ZERO;

    @Column(
            name = "total_amount",
            nullable = false,
            precision = 12,
            scale = 2
    )
    @Builder.Default
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(
            name = "amount_paid",
            nullable = false,
            precision = 12,
            scale = 2
    )
    @Builder.Default
    private BigDecimal amountPaid = BigDecimal.ZERO;

    @Column(
            name = "balance_due",
            nullable = false,
            precision = 12,
            scale = 2
    )
    @Builder.Default
    private BigDecimal balanceDue = BigDecimal.ZERO;

    @Column(
            nullable = false,
            length = 3
    )
    @Builder.Default
    private String currency = "INR";

    @OneToMany(
            mappedBy = "invoice",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<InvoiceItem> items = new ArrayList<>();

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

    public void addItem(InvoiceItem item) {
        items.add(item);
        item.setInvoice(this);
    }

    public void removeItem(InvoiceItem item) {
        items.remove(item);
        item.setInvoice(null);
    }

    @PrePersist
    public void beforeInsert() {
        LocalDateTime now = LocalDateTime.now();

        createdAt = now;
        updatedAt = now;
        normalizeAmounts();

        if (status == null) {
            status = InvoiceStatus.DRAFT;
        }

        if (currency == null || currency.isBlank()) {
            currency = "INR";
        }
    }

    @PreUpdate
    public void beforeUpdate() {
        updatedAt = LocalDateTime.now();
        normalizeAmounts();
    }

    private void normalizeAmounts() {
        taxableAmount = zeroIfNull(taxableAmount);
        cgstAmount = zeroIfNull(cgstAmount);
        sgstAmount = zeroIfNull(sgstAmount);
        igstAmount = zeroIfNull(igstAmount);
        totalTaxAmount = zeroIfNull(totalTaxAmount);
        totalAmount = zeroIfNull(totalAmount);
        amountPaid = zeroIfNull(amountPaid);
        balanceDue = zeroIfNull(balanceDue);

        if (taxableAmount.signum() < 0
                || cgstAmount.signum() < 0
                || sgstAmount.signum() < 0
                || igstAmount.signum() < 0
                || totalTaxAmount.signum() < 0
                || totalAmount.signum() < 0
                || amountPaid.signum() < 0
                || balanceDue.signum() < 0) {
            throw new IllegalStateException(
                    "Invoice amounts cannot be negative"
            );
        }
    }

    private BigDecimal zeroIfNull(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }
}

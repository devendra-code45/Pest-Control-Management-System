package com.pcms.payment.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
        name = "invoice_items",
        indexes = {
                @Index(
                        name = "idx_invoice_item_invoice_sort",
                        columnList = "invoice_id,sort_order"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "invoice_id",
            nullable = false
    )
    private Invoice invoice;

    @Column(
            nullable = false,
            length = 250
    )
    private String description;

    @Column(
            name = "sac_code",
            nullable = false,
            length = 20
    )
    private String sacCode;

    @Column(
            nullable = false,
            precision = 10,
            scale = 2
    )
    @Builder.Default
    private BigDecimal quantity = BigDecimal.ONE;

    @Column(
            name = "unit_price_inclusive_tax",
            nullable = false,
            precision = 12,
            scale = 2
    )
    private BigDecimal unitPriceInclusiveTax;

    @Column(
            name = "gst_rate",
            nullable = false,
            precision = 5,
            scale = 2
    )
    private BigDecimal gstRate;

    @Column(
            name = "taxable_amount",
            nullable = false,
            precision = 12,
            scale = 2
    )
    private BigDecimal taxableAmount;

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
            name = "total_amount",
            nullable = false,
            precision = 12,
            scale = 2
    )
    private BigDecimal totalAmount;

    @Column(
            name = "sort_order",
            nullable = false
    )
    @Builder.Default
    private Integer sortOrder = 0;

    @PrePersist
    public void beforeInsert() {
        if (quantity == null || quantity.signum() <= 0) {
            throw new IllegalStateException(
                    "Invoice item quantity must be greater than zero"
            );
        }

        if (unitPriceInclusiveTax == null
                || unitPriceInclusiveTax.signum() < 0) {
            throw new IllegalStateException(
                    "Invoice item unit price cannot be negative"
            );
        }

        if (gstRate == null || gstRate.signum() < 0) {
            throw new IllegalStateException(
                    "Invoice item GST rate cannot be negative"
            );
        }

        taxableAmount = zeroIfNull(taxableAmount);
        cgstAmount = zeroIfNull(cgstAmount);
        sgstAmount = zeroIfNull(sgstAmount);
        igstAmount = zeroIfNull(igstAmount);
        totalAmount = zeroIfNull(totalAmount);

        if (sortOrder == null || sortOrder < 0) {
            sortOrder = 0;
        }
    }

    private BigDecimal zeroIfNull(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }
}

package com.pcms.payment.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.pcms.payment.entity.CustomerBillingType;
import com.pcms.payment.entity.InvoiceStatus;
import com.pcms.payment.entity.TaxType;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class InvoiceResponse {

    private Long id;

    private String invoiceNumber;

    private Long bookingId;

    private Long paymentScheduleId;

    private Long customerId;

    private CustomerBillingType customerBillingType;

    private String supplierLegalName;

    private String supplierGstin;

    private String supplierAddress;

    private String supplierState;

    private String supplierStateCode;

    private String customerLegalName;

    private String customerGstin;

    private String billingAddress;

    private String billingCity;

    private String billingState;

    private String billingStateCode;

    private String billingPincode;

    private String placeOfSupply;

    private String placeOfSupplyCode;

    private TaxType taxType;

    private InvoiceStatus status;

    private LocalDate invoiceDate;

    private LocalDate dueDate;

    private BigDecimal taxableAmount;

    private BigDecimal cgstAmount;

    private BigDecimal sgstAmount;

    private BigDecimal igstAmount;

    private BigDecimal totalTaxAmount;

    private BigDecimal totalAmount;

    private BigDecimal amountPaid;

    private BigDecimal balanceDue;

    private String currency;

    private List<InvoiceItemResponse> items;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}

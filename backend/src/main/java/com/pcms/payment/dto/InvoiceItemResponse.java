package com.pcms.payment.dto;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class InvoiceItemResponse {

    private Long id;

    private String description;

    private String sacCode;

    private BigDecimal quantity;

    private BigDecimal unitPriceInclusiveTax;

    private BigDecimal gstRate;

    private BigDecimal taxableAmount;

    private BigDecimal cgstAmount;

    private BigDecimal sgstAmount;

    private BigDecimal igstAmount;

    private BigDecimal totalAmount;

    private Integer sortOrder;
}

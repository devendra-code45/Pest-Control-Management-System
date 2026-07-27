package com.pcms.booking.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.pcms.booking.entity.BookingStatus;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class BookingResponse {

    private Long id;

    private String customerName;

    private String serviceName;

    private String serviceType;

    private BigDecimal servicePrice;

    private BigDecimal inspectionCharge;

    private BigDecimal convenienceFee;

    private BigDecimal totalAmount;

    private String propertyType;

    private String propertySize;

    private String serviceAddress;

    private String landmark;

    private String city;

    private String pincode;

    private LocalDate preferredDate;

    private String preferredTimeSlot;

    private String pestType;

    private String problemDescription;

    private String technicianName;

    private String technicianPhone;

    private BookingStatus status;

    private String rejectionReason;

    private LocalDateTime createdAt;
}
package com.pcms.booking.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.pcms.user.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "customer_id",
            nullable = false
    )
    private User customer;

    @Column(nullable = false)
    private String serviceName;

    @Column(nullable = false)
    private String serviceType;

    @Column(
            nullable = false,
            precision = 10,
            scale = 2
    )
    private BigDecimal servicePrice;

    @Column(
            nullable = false,
            precision = 10,
            scale = 2
    )
    private BigDecimal inspectionCharge;

    @Column(
            nullable = false,
            precision = 10,
            scale = 2
    )
    private BigDecimal convenienceFee;

    @Column(
            nullable = false,
            precision = 10,
            scale = 2
    )
    private BigDecimal totalAmount;

    @Column(nullable = false)
    private String propertyType;

    @Column(nullable = false)
    private String propertySize;

    @Column(
            nullable = false,
            length = 500
    )
    private String serviceAddress;

    @Column(length = 150)
    private String landmark;

    @Column(nullable = false)
    private String city;

    @Column(
            nullable = false,
            length = 6
    )
    private String pincode;

    @Column(nullable = false)
    private LocalDate preferredDate;

    @Column(nullable = false)
    private String preferredTimeSlot;

    @Column(nullable = false)
    private String pestType;

    @Column(
            nullable = false,
            length = 500
    )
    private String problemDescription;

    private Long technicianId;

    private String technicianName;

    private String technicianPhone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status;

    @Column(length = 500)
    private String rejectionReason;

    @Column(
            nullable = false,
            updatable = false
    )
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void beforeInsert() {
        LocalDateTime now = LocalDateTime.now();

        createdAt = now;
        updatedAt = now;

        if (status == null) {
            status = BookingStatus.PENDING;
        }

        if (inspectionCharge == null) {
            inspectionCharge = BigDecimal.ZERO;
        }

        if (convenienceFee == null) {
            convenienceFee = BigDecimal.ZERO;
        }

        if (servicePrice == null) {
            servicePrice = BigDecimal.ZERO;
        }

        if (totalAmount == null) {
            totalAmount = servicePrice
                    .add(inspectionCharge)
                    .add(convenienceFee);
        }
    }

    @PreUpdate
    public void beforeUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
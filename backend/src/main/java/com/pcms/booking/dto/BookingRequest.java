package com.pcms.booking.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingRequest {

    @NotBlank(message = "Service name is required")
    private String serviceName;

    @NotBlank(message = "Service type is required")
    private String serviceType;

    @NotBlank(message = "Property type is required")
    private String propertyType;

    @NotBlank(message = "Property size is required")
    private String propertySize;

    @NotBlank(message = "Service address is required")
    @Size(
            max = 500,
            message = "Service address cannot exceed 500 characters"
    )
    private String serviceAddress;

    @Size(
            max = 150,
            message = "Landmark cannot exceed 150 characters"
    )
    private String landmark;

    @NotBlank(message = "City is required")
    @Size(
            max = 100,
            message = "City cannot exceed 100 characters"
    )
    private String city;

    @NotBlank(message = "Pincode is required")
    @Pattern(
            regexp = "^[0-9]{6}$",
            message = "Pincode must contain exactly 6 digits"
    )
    private String pincode;

    @NotNull(message = "Preferred date is required")
    @FutureOrPresent(
            message = "Preferred date cannot be in the past"
    )
    private LocalDate preferredDate;

    @NotBlank(message = "Preferred time slot is required")
    private String preferredTimeSlot;

    @NotBlank(message = "Service frequency is required")
    @Pattern(
            regexp = "^(ONE_TIME|WEEKLY|MONTHLY|QUARTERLY|HALF_YEARLY|YEARLY)$",
            message = "Select a valid service frequency"
    )
    private String serviceFrequency;

    @NotBlank(message = "Pest type is required")
    private String pestType;

    @NotBlank(message = "Problem description is required")
    @Size(
            max = 500,
            message = "Problem description cannot exceed 500 characters"
    )
    private String problemDescription;
}
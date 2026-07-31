package com.pcms.service.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ServiceRequest {

    @NotBlank(message = "Service name is required")
    @Size(
            max = 100,
            message = "Service name cannot exceed 100 characters"
    )
    private String name;

    @NotBlank(message = "Category is required")
    @Size(
            max = 100,
            message = "Category cannot exceed 100 characters"
    )
    private String category;

    @NotBlank(message = "Description is required")
    @Size(
            max = 1000,
            message = "Description cannot exceed 1000 characters"
    )
    private String description;

    @NotBlank(message = "Duration is required")
    @Size(
            max = 50,
            message = "Duration cannot exceed 50 characters"
    )
    private String duration;

    @NotNull(message = "Price is required")
    @DecimalMin(
            value = "0.0",
            inclusive = true,
            message = "Price cannot be negative"
    )
    private BigDecimal price;

    private Boolean active;

    /*
     * Base64 data URL sent by the React FileReader.
     * Example: data:image/jpeg;base64,/9j/4AAQ...
     */
    @Size(
            max = 4000000,
            message = "Service image is too large"
    )
    private String serviceImage;

    public String getName() {
        return name;
    }

    public void setName(
            String name) {

        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(
            String category) {

        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(
            String description) {

        this.description = description;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(
            String duration) {

        this.duration = duration;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(
            BigDecimal price) {

        this.price = price;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(
            Boolean active) {

        this.active = active;
    }

    public String getServiceImage() {
        return serviceImage;
    }

    public void setServiceImage(
            String serviceImage) {

        this.serviceImage = serviceImage;
    }
}
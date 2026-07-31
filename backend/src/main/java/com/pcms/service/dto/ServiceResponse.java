package com.pcms.service.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ServiceResponse {

    private Long id;
    private String name;
    private String category;
    private String description;
    private String duration;
    private BigDecimal price;
    private Boolean active;
    private String serviceImage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(
            LocalDateTime createdAt) {

        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(
            LocalDateTime updatedAt) {

        this.updatedAt = updatedAt;
    }
}
package com.pcms.complaint.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


public class ComplaintResponse {

    public ComplaintResponse() {
    }
    private String id;
    private String bookingId;

    private String customer;
    private String email;
    private String phone;

    private String serviceName;
    private LocalDate serviceDate;
    private String serviceAddress;

    private String subject;
    private String category;
    private String description;
    private String status;
    private String adminResponse;

    private ComplaintAttachmentResponse attachment;
    private ComplaintAttachmentResponse responseAttachment;

    private LocalDateTime submittedOn;
    private LocalDateTime updatedAt;

    private List<ComplaintHistoryResponse> history;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getBookingId() {
        return bookingId;
    }

    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }

    public String getCustomer() {
        return customer;
    }

    public void setCustomer(String customer) {
        this.customer = customer;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public LocalDate getServiceDate() {
        return serviceDate;
    }

    public void setServiceDate(LocalDate serviceDate) {
        this.serviceDate = serviceDate;
    }

    public String getServiceAddress() {
        return serviceAddress;
    }

    public void setServiceAddress(String serviceAddress) {
        this.serviceAddress = serviceAddress;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAdminResponse() {
        return adminResponse;
    }

    public void setAdminResponse(String adminResponse) {
        this.adminResponse = adminResponse;
    }

    public ComplaintAttachmentResponse getAttachment() {
        return attachment;
    }

    public void setAttachment(ComplaintAttachmentResponse attachment) {
        this.attachment = attachment;
    }

    public ComplaintAttachmentResponse getResponseAttachment() {
        return responseAttachment;
    }

    public void setResponseAttachment(ComplaintAttachmentResponse responseAttachment) {
        this.responseAttachment = responseAttachment;
    }

    public LocalDateTime getSubmittedOn() {
        return submittedOn;
    }

    public void setSubmittedOn(LocalDateTime submittedOn) {
        this.submittedOn = submittedOn;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<ComplaintHistoryResponse> getHistory() {
        return history;
    }

    public void setHistory(List<ComplaintHistoryResponse> history) {
        this.history = history;
    }
}

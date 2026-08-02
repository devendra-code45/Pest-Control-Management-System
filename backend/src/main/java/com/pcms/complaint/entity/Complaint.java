package com.pcms.complaint.entity;

import java.time.LocalDateTime;

import com.pcms.booking.entity.Booking;
import com.pcms.user.entity.User;

import jakarta.persistence.*;

@Entity
@Table(name = "complaints")
public class Complaint {

    public Complaint() {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "complaint_number", unique = true, length = 30)
    private String complaintNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @Column(name = "booking_reference", length = 30)
    private String bookingReference;

    @Column(nullable = false, length = 150)
    private String subject;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ComplaintCategory category;

    @Column(nullable = false, length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ComplaintStatus status;

    @Column(name = "admin_response", length = 1000)
    private String adminResponse;

    @Column(name = "attachment_original_name")
    private String attachmentOriginalName;

    @Column(name = "attachment_stored_name")
    private String attachmentStoredName;

    @Column(name = "attachment_content_type", length = 120)
    private String attachmentContentType;

    @Column(name = "attachment_size")
    private Long attachmentSize;

    @Column(name = "response_attachment_original_name")
    private String responseAttachmentOriginalName;

    @Column(name = "response_attachment_stored_name")
    private String responseAttachmentStoredName;

    @Column(name = "response_attachment_content_type", length = 120)
    private String responseAttachmentContentType;

    @Column(name = "response_attachment_size")
    private Long responseAttachmentSize;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void beforeInsert() {
        LocalDateTime now = LocalDateTime.now();
        if (status == null) status = ComplaintStatus.PENDING;
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    public void beforeUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getComplaintNumber() {
        return complaintNumber;
    }

    public void setComplaintNumber(String complaintNumber) {
        this.complaintNumber = complaintNumber;
    }

    public User getCustomer() {
        return customer;
    }

    public void setCustomer(User customer) {
        this.customer = customer;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    public String getBookingReference() {
        return bookingReference;
    }

    public void setBookingReference(String bookingReference) {
        this.bookingReference = bookingReference;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public ComplaintCategory getCategory() {
        return category;
    }

    public void setCategory(ComplaintCategory category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ComplaintStatus getStatus() {
        return status;
    }

    public void setStatus(ComplaintStatus status) {
        this.status = status;
    }

    public String getAdminResponse() {
        return adminResponse;
    }

    public void setAdminResponse(String adminResponse) {
        this.adminResponse = adminResponse;
    }

    public String getAttachmentOriginalName() {
        return attachmentOriginalName;
    }

    public void setAttachmentOriginalName(String attachmentOriginalName) {
        this.attachmentOriginalName = attachmentOriginalName;
    }

    public String getAttachmentStoredName() {
        return attachmentStoredName;
    }

    public void setAttachmentStoredName(String attachmentStoredName) {
        this.attachmentStoredName = attachmentStoredName;
    }

    public String getAttachmentContentType() {
        return attachmentContentType;
    }

    public void setAttachmentContentType(String attachmentContentType) {
        this.attachmentContentType = attachmentContentType;
    }

    public Long getAttachmentSize() {
        return attachmentSize;
    }

    public void setAttachmentSize(Long attachmentSize) {
        this.attachmentSize = attachmentSize;
    }

    public String getResponseAttachmentOriginalName() {
        return responseAttachmentOriginalName;
    }

    public void setResponseAttachmentOriginalName(String responseAttachmentOriginalName) {
        this.responseAttachmentOriginalName = responseAttachmentOriginalName;
    }

    public String getResponseAttachmentStoredName() {
        return responseAttachmentStoredName;
    }

    public void setResponseAttachmentStoredName(String responseAttachmentStoredName) {
        this.responseAttachmentStoredName = responseAttachmentStoredName;
    }

    public String getResponseAttachmentContentType() {
        return responseAttachmentContentType;
    }

    public void setResponseAttachmentContentType(String responseAttachmentContentType) {
        this.responseAttachmentContentType = responseAttachmentContentType;
    }

    public Long getResponseAttachmentSize() {
        return responseAttachmentSize;
    }

    public void setResponseAttachmentSize(Long responseAttachmentSize) {
        this.responseAttachmentSize = responseAttachmentSize;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

package com.pcms.notification.entity;

import java.time.LocalDateTime;

import com.pcms.user.entity.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(
        name = "notifications",
        indexes = {
                @Index(
                        name = "idx_notification_recipient",
                        columnList = "recipient_role, recipient_email"
                ),
                @Index(
                        name = "idx_notification_created_at",
                        columnList = "created_at"
                )
        }
)
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "recipient_role", nullable = false, length = 30)
    private Role recipientRole;

    @Column(name = "recipient_email", length = 160)
    private String recipientEmail;

    @Column(nullable = false, length = 120)
    private String title;

    @Column(nullable = false, length = 500)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private NotificationType type;

    @Column(name = "read_status", nullable = false)
    private boolean readStatus = false;

    @Column(name = "related_booking_id")
    private Long relatedBookingId;

    @Column(name = "related_payment_id")
    private Long relatedPaymentId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Notification() {
    }

    @PrePersist
    public void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Role getRecipientRole() {
        return recipientRole;
    }

    public void setRecipientRole(Role recipientRole) {
        this.recipientRole = recipientRole;
    }

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public boolean isReadStatus() {
        return readStatus;
    }

    public void setReadStatus(boolean readStatus) {
        this.readStatus = readStatus;
    }

    public Long getRelatedBookingId() {
        return relatedBookingId;
    }

    public void setRelatedBookingId(Long relatedBookingId) {
        this.relatedBookingId = relatedBookingId;
    }

    public Long getRelatedPaymentId() {
        return relatedPaymentId;
    }

    public void setRelatedPaymentId(Long relatedPaymentId) {
        this.relatedPaymentId = relatedPaymentId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

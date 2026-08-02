package com.pcms.complaint.dto;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ComplaintRequest {

    public ComplaintRequest() {
    }

    @NotBlank(message = "Subject is required.")
    @Size(min = 5, max = 150, message = "Subject must contain between 5 and 150 characters.")
    private String subject;

    @NotBlank(message = "Category is required.")
    private String category;

    private String bookingId;

    @NotBlank(message = "Description is required.")
    @Size(min = 15, max = 1000, message = "Description must contain between 15 and 1000 characters.")
    private String description;

    private MultipartFile attachment;

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

    public String getBookingId() {
        return bookingId;
    }

    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public MultipartFile getAttachment() {
        return attachment;
    }

    public void setAttachment(MultipartFile attachment) {
        this.attachment = attachment;
    }
}

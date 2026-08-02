package com.pcms.complaint.dto;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ComplaintUpdateRequest {

    public ComplaintUpdateRequest() {
    }

    @NotBlank(message = "Complaint status is required.")
    private String status;

    @NotBlank(message = "Admin response is required.")
    @Size(max = 1000, message = "Admin response must not exceed 1000 characters.")
    private String response;

    private MultipartFile attachment;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }

    public MultipartFile getAttachment() {
        return attachment;
    }

    public void setAttachment(MultipartFile attachment) {
        this.attachment = attachment;
    }
}

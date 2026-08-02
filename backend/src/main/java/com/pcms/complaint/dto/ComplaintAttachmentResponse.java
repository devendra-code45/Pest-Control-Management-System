package com.pcms.complaint.dto;


public class ComplaintAttachmentResponse {

    public ComplaintAttachmentResponse() {
    }
    private String name;
    private String type;
    private Long size;
    private String customerDownloadUrl;
    private String adminDownloadUrl;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getSize() {
        return size;
    }

    public void setSize(Long size) {
        this.size = size;
    }

    public String getCustomerDownloadUrl() {
        return customerDownloadUrl;
    }

    public void setCustomerDownloadUrl(String customerDownloadUrl) {
        this.customerDownloadUrl = customerDownloadUrl;
    }

    public String getAdminDownloadUrl() {
        return adminDownloadUrl;
    }

    public void setAdminDownloadUrl(String adminDownloadUrl) {
        this.adminDownloadUrl = adminDownloadUrl;
    }
}

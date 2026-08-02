package com.pcms.complaint.service;

import java.nio.file.Path;
import java.util.List;

import com.pcms.complaint.dto.ComplaintRequest;
import com.pcms.complaint.dto.ComplaintResponse;
import com.pcms.complaint.dto.ComplaintUpdateRequest;

public interface ComplaintService {
    ComplaintResponse createComplaint(String customerEmail, ComplaintRequest request);
    List<ComplaintResponse> getMyComplaints(String customerEmail);
    ComplaintResponse getMyComplaint(String complaintNumber, String customerEmail);

    List<ComplaintResponse> getAllComplaints();
    ComplaintResponse getComplaintForAdmin(String complaintNumber);
    ComplaintResponse updateComplaint(String complaintNumber, ComplaintUpdateRequest request);

    StoredComplaintFile getCustomerAttachment(String complaintNumber, String requesterEmail, boolean adminRequest);
    StoredComplaintFile getResponseAttachment(String complaintNumber, String requesterEmail, boolean adminRequest);

    record StoredComplaintFile(Path path, String originalName, String contentType) {}
}

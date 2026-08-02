package com.pcms.complaint.controller;

import java.util.List;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pcms.complaint.dto.ComplaintResponse;
import com.pcms.complaint.dto.ComplaintUpdateRequest;
import com.pcms.complaint.service.ComplaintService;
import com.pcms.complaint.service.ComplaintService.StoredComplaintFile;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/complaints")
public class AdminComplaintController {

    private final ComplaintService complaintService;

    public AdminComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @GetMapping
    public ResponseEntity<List<ComplaintResponse>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @GetMapping("/{complaintNumber}")
    public ResponseEntity<ComplaintResponse> getComplaint(
            @PathVariable String complaintNumber) {

        return ResponseEntity.ok(
                complaintService.getComplaintForAdmin(complaintNumber));
    }

    @PatchMapping(
            value = "/{complaintNumber}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ComplaintResponse> updateComplaint(
            @PathVariable String complaintNumber,
            @Valid @ModelAttribute ComplaintUpdateRequest request) {

        return ResponseEntity.ok(
                complaintService.updateComplaint(
                        complaintNumber,
                        request));
    }

    @GetMapping("/{complaintNumber}/attachment")
    public ResponseEntity<Resource> downloadAttachment(
            @PathVariable String complaintNumber,
            Authentication authentication) {

        return buildFileResponse(
                complaintService.getCustomerAttachment(
                        complaintNumber,
                        authentication.getName(),
                        true));
    }

    @GetMapping("/{complaintNumber}/response-attachment")
    public ResponseEntity<Resource> downloadResponseAttachment(
            @PathVariable String complaintNumber,
            Authentication authentication) {

        return buildFileResponse(
                complaintService.getResponseAttachment(
                        complaintNumber,
                        authentication.getName(),
                        true));
    }

    private ResponseEntity<Resource> buildFileResponse(
            StoredComplaintFile storedFile) {

        FileSystemResource resource = new FileSystemResource(storedFile.path());

        if (!resource.exists()) {
            throw new RuntimeException("Attachment file not found.");
        }

        MediaType mediaType;

        try {
            mediaType = MediaType.parseMediaType(storedFile.contentType());
        } catch (Exception exception) {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        }

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment()
                                .filename(storedFile.originalName())
                                .build()
                                .toString())
                .body(resource);
    }
}

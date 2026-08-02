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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pcms.complaint.dto.ComplaintRequest;
import com.pcms.complaint.dto.ComplaintResponse;
import com.pcms.complaint.service.ComplaintService;
import com.pcms.complaint.service.ComplaintService.StoredComplaintFile;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/customer/complaints")
public class CustomerComplaintController {

    private final ComplaintService complaintService;

    public CustomerComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ComplaintResponse> createComplaint(
            @Valid @ModelAttribute ComplaintRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                complaintService.createComplaint(
                        authentication.getName(),
                        request));
    }

    @GetMapping
    public ResponseEntity<List<ComplaintResponse>> getMyComplaints(
            Authentication authentication) {

        return ResponseEntity.ok(
                complaintService.getMyComplaints(
                        authentication.getName()));
    }

    @GetMapping("/{complaintNumber}")
    public ResponseEntity<ComplaintResponse> getMyComplaint(
            @PathVariable String complaintNumber,
            Authentication authentication) {

        return ResponseEntity.ok(
                complaintService.getMyComplaint(
                        complaintNumber,
                        authentication.getName()));
    }

    @GetMapping("/{complaintNumber}/attachment")
    public ResponseEntity<Resource> downloadAttachment(
            @PathVariable String complaintNumber,
            Authentication authentication) {

        return buildFileResponse(
                complaintService.getCustomerAttachment(
                        complaintNumber,
                        authentication.getName(),
                        false));
    }

    @GetMapping("/{complaintNumber}/response-attachment")
    public ResponseEntity<Resource> downloadResponseAttachment(
            @PathVariable String complaintNumber,
            Authentication authentication) {

        return buildFileResponse(
                complaintService.getResponseAttachment(
                        complaintNumber,
                        authentication.getName(),
                        false));
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

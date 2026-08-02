package com.pcms.complaint.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.pcms.booking.entity.Booking;
import com.pcms.booking.repository.BookingRepository;
import com.pcms.complaint.dto.ComplaintAttachmentResponse;
import com.pcms.complaint.dto.ComplaintHistoryResponse;
import com.pcms.complaint.dto.ComplaintRequest;
import com.pcms.complaint.dto.ComplaintResponse;
import com.pcms.complaint.dto.ComplaintUpdateRequest;
import com.pcms.complaint.entity.Complaint;
import com.pcms.complaint.entity.ComplaintCategory;
import com.pcms.complaint.entity.ComplaintHistory;
import com.pcms.complaint.entity.ComplaintStatus;
import com.pcms.complaint.repository.ComplaintHistoryRepository;
import com.pcms.complaint.repository.ComplaintRepository;
import com.pcms.complaint.service.ComplaintService;
import com.pcms.notification.entity.NotificationType;
import com.pcms.notification.service.NotificationService;
import com.pcms.user.entity.User;
import com.pcms.user.repository.UserRepository;

@Service
public class ComplaintServiceImpl implements ComplaintService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ComplaintServiceImpl.class);
    private static final long MAX_FILE_SIZE = 5L * 1024L * 1024L;

    private static final Pattern BOOKING_PATTERN =
            Pattern.compile("^BK-(?:\\d{4}-)?(\\d+)$", Pattern.CASE_INSENSITIVE);

    private final ComplaintRepository complaintRepository;
    private final ComplaintHistoryRepository historyRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;
    private final Path uploadDirectory;

    public ComplaintServiceImpl(
            ComplaintRepository complaintRepository,
            ComplaintHistoryRepository historyRepository,
            UserRepository userRepository,
            BookingRepository bookingRepository,
            NotificationService notificationService,
            @Value("${pcms.complaint.upload-dir:uploads/complaints}") String uploadDirectory) {

        this.complaintRepository = complaintRepository;
        this.historyRepository = historyRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.notificationService = notificationService;
        this.uploadDirectory = Path.of(uploadDirectory).toAbsolutePath().normalize();
    }

    @Override
    @Transactional
    public ComplaintResponse createComplaint(String customerEmail, ComplaintRequest request) {
        User customer = findUser(customerEmail);
        Booking booking = resolveBooking(request.getBookingId(), customer);

        Complaint complaint = new Complaint();
        complaint.setCustomer(customer);
        complaint.setBooking(booking);
        complaint.setBookingReference(cleanOptional(request.getBookingId()));
        complaint.setSubject(request.getSubject().trim());
        complaint.setCategory(ComplaintCategory.fromValue(request.getCategory()));
        complaint.setDescription(request.getDescription().trim());
        complaint.setStatus(ComplaintStatus.PENDING);

        storeCustomerAttachment(complaint, request.getAttachment());

        Complaint created = complaintRepository.save(complaint);
        created.setComplaintNumber(buildComplaintNumber(created.getId()));
        Complaint saved = complaintRepository.save(created);

        addHistory(saved, ComplaintStatus.PENDING, "Complaint submitted by customer.", "CUSTOMER");

        scheduleAfterCommit(() -> {
            try {
                notificationService.createAdminNotification(
                        "New Complaint Received",
                        saved.getComplaintNumber() + " was submitted by " + customer.getFullName() + ".",
                        NotificationType.COMPLAINT_CREATED,
                        booking == null ? null : booking.getId(),
                        null);
            } catch (RuntimeException exception) {
                LOGGER.error(
                        "Unable to create admin notification for complaint {}.",
                        saved.getComplaintNumber(),
                        exception);
            }
        });

        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComplaintResponse> getMyComplaints(String customerEmail) {
        User customer = findUser(customerEmail);

        return complaintRepository.findByCustomerOrderByCreatedAtDesc(customer)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ComplaintResponse getMyComplaint(String complaintNumber, String customerEmail) {
        User customer = findUser(customerEmail);

        Complaint complaint = complaintRepository
                .findByComplaintNumberAndCustomer(
                        normalizeComplaintNumber(complaintNumber),
                        customer)
                .orElseThrow(() -> new RuntimeException("Complaint not found."));

        return toResponse(complaint);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComplaintResponse> getAllComplaints() {
        return complaintRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ComplaintResponse getComplaintForAdmin(String complaintNumber) {
        return toResponse(findComplaint(complaintNumber));
    }

    @Override
    @Transactional
    public ComplaintResponse updateComplaint(
            String complaintNumber,
            ComplaintUpdateRequest request) {

        Complaint complaint = findComplaint(complaintNumber);
        ComplaintStatus newStatus = ComplaintStatus.fromValue(request.getStatus());

        if (newStatus == ComplaintStatus.PENDING) {
            throw new RuntimeException("Admin cannot change a complaint back to Pending.");
        }

        complaint.setStatus(newStatus);
        complaint.setAdminResponse(request.getResponse().trim());

        if (newStatus == ComplaintStatus.RESOLVED || newStatus == ComplaintStatus.CLOSED) {
            complaint.setResolvedAt(LocalDateTime.now());
        } else {
            complaint.setResolvedAt(null);
        }

        storeResponseAttachment(complaint, request.getAttachment());

        Complaint saved = complaintRepository.save(complaint);

        addHistory(
                saved,
                newStatus,
                saved.getAdminResponse(),
                "ADMIN");

        scheduleCustomerStatusNotification(saved);

        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public StoredComplaintFile getCustomerAttachment(
            String complaintNumber,
            String requesterEmail,
            boolean adminRequest) {

        Complaint complaint = resolveAccessibleComplaint(
                complaintNumber,
                requesterEmail,
                adminRequest);

        if (complaint.getAttachmentStoredName() == null) {
            throw new RuntimeException("Complaint attachment not found.");
        }

        return new StoredComplaintFile(
                uploadDirectory.resolve(complaint.getAttachmentStoredName()),
                complaint.getAttachmentOriginalName(),
                complaint.getAttachmentContentType());
    }

    @Override
    @Transactional(readOnly = true)
    public StoredComplaintFile getResponseAttachment(
            String complaintNumber,
            String requesterEmail,
            boolean adminRequest) {

        Complaint complaint = resolveAccessibleComplaint(
                complaintNumber,
                requesterEmail,
                adminRequest);

        if (complaint.getResponseAttachmentStoredName() == null) {
            throw new RuntimeException("Response attachment not found.");
        }

        return new StoredComplaintFile(
                uploadDirectory.resolve(complaint.getResponseAttachmentStoredName()),
                complaint.getResponseAttachmentOriginalName(),
                complaint.getResponseAttachmentContentType());
    }

    private Complaint resolveAccessibleComplaint(
            String complaintNumber,
            String requesterEmail,
            boolean adminRequest) {

        if (adminRequest) {
            return findComplaint(complaintNumber);
        }

        User customer = findUser(requesterEmail);

        return complaintRepository
                .findByComplaintNumberAndCustomer(
                        normalizeComplaintNumber(complaintNumber),
                        customer)
                .orElseThrow(() -> new RuntimeException("Complaint not found."));
    }

    private void scheduleCustomerStatusNotification(Complaint complaint) {
        String title;
        NotificationType type;

        switch (complaint.getStatus()) {
            case IN_PROGRESS -> {
                title = "Complaint In Progress";
                type = NotificationType.COMPLAINT_IN_PROGRESS;
            }
            case RESOLVED -> {
                title = "Complaint Resolved";
                type = NotificationType.COMPLAINT_RESOLVED;
            }
            case CLOSED -> {
                title = "Complaint Closed";
                type = NotificationType.COMPLAINT_CLOSED;
            }
            case REJECTED -> {
                title = "Complaint Rejected";
                type = NotificationType.COMPLAINT_REJECTED;
            }
            default -> {
                return;
            }
        }

        scheduleAfterCommit(() -> {
            try {
                notificationService.createCustomerNotification(
                        complaint.getCustomer().getEmail(),
                        title,
                        complaint.getComplaintNumber()
                                + " status was updated to "
                                + complaint.getStatus().getDisplayName()
                                + ".",
                        type,
                        complaint.getBooking() == null ? null : complaint.getBooking().getId(),
                        null);
            } catch (RuntimeException exception) {
                LOGGER.error(
                        "Unable to create customer notification for complaint {}.",
                        complaint.getComplaintNumber(),
                        exception);
            }
        });
    }

    private void scheduleAfterCommit(Runnable task) {
        if (TransactionSynchronizationManager.isSynchronizationActive()) {
            TransactionSynchronizationManager.registerSynchronization(
                    new TransactionSynchronization() {
                        @Override
                        public void afterCommit() {
                            task.run();
                        }
                    });
        } else {
            task.run();
        }
    }

    private void addHistory(
            Complaint complaint,
            ComplaintStatus status,
            String note,
            String updatedBy) {

        ComplaintHistory history = new ComplaintHistory();
        history.setComplaint(complaint);
        history.setStatus(status);
        history.setNote(note);
        history.setUpdatedBy(updatedBy);
        historyRepository.save(history);
    }

    private Booking resolveBooking(String bookingReference, User customer) {
        String cleaned = cleanOptional(bookingReference);

        if (cleaned == null) {
            return null;
        }

        Matcher matcher = BOOKING_PATTERN.matcher(cleaned);

        if (!matcher.matches()) {
            throw new RuntimeException(
                    "Use booking ID format BK-2025-0012 or BK-0012.");
        }

        Long bookingId = Long.valueOf(matcher.group(1));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found."));

        if (!booking.getCustomer().getId().equals(customer.getId())) {
            throw new RuntimeException(
                    "You cannot raise a complaint for another customer's booking.");
        }

        return booking;
    }

    private void storeCustomerAttachment(Complaint complaint, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return;
        }

        StoredFile stored = storeFile(file);

        complaint.setAttachmentOriginalName(stored.originalName());
        complaint.setAttachmentStoredName(stored.storedName());
        complaint.setAttachmentContentType(stored.contentType());
        complaint.setAttachmentSize(stored.size());
    }

    private void storeResponseAttachment(Complaint complaint, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return;
        }

        deleteExistingFile(complaint.getResponseAttachmentStoredName());

        StoredFile stored = storeFile(file);

        complaint.setResponseAttachmentOriginalName(stored.originalName());
        complaint.setResponseAttachmentStoredName(stored.storedName());
        complaint.setResponseAttachmentContentType(stored.contentType());
        complaint.setResponseAttachmentSize(stored.size());
    }

    private StoredFile storeFile(MultipartFile file) {
        validateFile(file);

        try {
            Files.createDirectories(uploadDirectory);

            String originalName = StringUtils.cleanPath(
                    file.getOriginalFilename() == null
                            ? "attachment"
                            : file.getOriginalFilename());

            String extension = getExtension(originalName);
            String storedName = UUID.randomUUID() + extension;
            Path target = uploadDirectory.resolve(storedName).normalize();

            if (!target.startsWith(uploadDirectory)) {
                throw new RuntimeException("Invalid attachment path.");
            }

            Files.copy(
                    file.getInputStream(),
                    target,
                    StandardCopyOption.REPLACE_EXISTING);

            return new StoredFile(
                    originalName,
                    storedName,
                    file.getContentType(),
                    file.getSize());
        } catch (IOException exception) {
            throw new RuntimeException(
                    "Unable to save complaint attachment.",
                    exception);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new RuntimeException("Attachment must not exceed 5 MB.");
        }

        String type = file.getContentType();

        boolean allowed =
                "application/pdf".equalsIgnoreCase(type)
                        || "image/jpeg".equalsIgnoreCase(type)
                        || "image/png".equalsIgnoreCase(type);

        if (!allowed) {
            throw new RuntimeException(
                    "Only PDF, JPG and PNG attachments are allowed.");
        }
    }

    private void deleteExistingFile(String storedName) {
        if (storedName == null) {
            return;
        }

        try {
            Files.deleteIfExists(uploadDirectory.resolve(storedName));
        } catch (IOException exception) {
            LOGGER.warn(
                    "Unable to delete old complaint attachment {}.",
                    storedName,
                    exception);
        }
    }

    private String getExtension(String fileName) {
        int index = fileName.lastIndexOf('.');

        if (index < 0 || index == fileName.length() - 1) {
            return "";
        }

        return fileName.substring(index).toLowerCase(Locale.ENGLISH);
    }

    private ComplaintResponse toResponse(Complaint complaint) {
        ComplaintResponse response = new ComplaintResponse();

        User customer = complaint.getCustomer();
        Booking booking = complaint.getBooking();

        response.setId(complaint.getComplaintNumber());
        response.setBookingId(complaint.getBookingReference());

        response.setCustomer(customer.getFullName());
        response.setEmail(customer.getEmail());
        response.setPhone(customer.getPhone());

        if (booking != null) {
            response.setServiceName(booking.getServiceName());
            response.setServiceDate(booking.getPreferredDate());
            response.setServiceAddress(booking.getServiceAddress());
        }

        response.setSubject(complaint.getSubject());
        response.setCategory(complaint.getCategory().getDisplayName());
        response.setDescription(complaint.getDescription());
        response.setStatus(complaint.getStatus().getDisplayName());
        response.setAdminResponse(complaint.getAdminResponse());
        response.setSubmittedOn(complaint.getCreatedAt());
        response.setUpdatedAt(complaint.getUpdatedAt());

        response.setAttachment(buildAttachment(
                complaint.getAttachmentOriginalName(),
                complaint.getAttachmentContentType(),
                complaint.getAttachmentSize(),
                complaint.getComplaintNumber(),
                false));

        response.setResponseAttachment(buildAttachment(
                complaint.getResponseAttachmentOriginalName(),
                complaint.getResponseAttachmentContentType(),
                complaint.getResponseAttachmentSize(),
                complaint.getComplaintNumber(),
                true));

        response.setHistory(
                historyRepository.findByComplaintOrderByCreatedAtAsc(complaint)
                        .stream()
                        .map(this::toHistoryResponse)
                        .toList());

        return response;
    }

    private ComplaintAttachmentResponse buildAttachment(
            String name,
            String type,
            Long size,
            String complaintNumber,
            boolean responseAttachment) {

        if (name == null) {
            return null;
        }

        String suffix = responseAttachment
                ? "/response-attachment"
                : "/attachment";

        ComplaintAttachmentResponse response = new ComplaintAttachmentResponse();
        response.setName(name);
        response.setType(type);
        response.setSize(size);
        response.setCustomerDownloadUrl(
                "/api/customer/complaints/" + complaintNumber + suffix);
        response.setAdminDownloadUrl(
                "/api/admin/complaints/" + complaintNumber + suffix);

        return response;
    }

    private ComplaintHistoryResponse toHistoryResponse(ComplaintHistory history) {
        ComplaintHistoryResponse response = new ComplaintHistoryResponse();
        response.setId(history.getId());
        response.setStatus(history.getStatus().getDisplayName());
        response.setNote(history.getNote());
        response.setUpdatedBy(history.getUpdatedBy());
        response.setCreatedAt(history.getCreatedAt());
        return response;
    }

    private User findUser(String email) {
        return userRepository.findByEmail(normalizeEmail(email))
                .orElseThrow(() -> new RuntimeException("Customer not found."));
    }

    private Complaint findComplaint(String complaintNumber) {
        return complaintRepository.findByComplaintNumber(
                        normalizeComplaintNumber(complaintNumber))
                .orElseThrow(() -> new RuntimeException("Complaint not found."));
    }

    private String normalizeEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new RuntimeException("Customer email is required.");
        }

        return email.trim().toLowerCase();
    }

    private String normalizeComplaintNumber(String complaintNumber) {
        if (complaintNumber == null || complaintNumber.isBlank()) {
            throw new RuntimeException("Complaint ID is required.");
        }

        return complaintNumber.trim().toUpperCase();
    }

    private String cleanOptional(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim().toUpperCase();
    }

    private String buildComplaintNumber(Long complaintId) {
        return "CMP-"
                + LocalDate.now().getYear()
                + "-"
                + String.format("%04d", complaintId);
    }

    private record StoredFile(
            String originalName,
            String storedName,
            String contentType,
            long size) {
    }
}

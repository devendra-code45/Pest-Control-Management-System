package com.pcms.booking.service.impl;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pcms.booking.dto.BookingRequest;
import com.pcms.booking.dto.BookingResponse;
import com.pcms.booking.entity.Booking;
import com.pcms.booking.entity.BookingStatus;
import com.pcms.booking.repository.BookingRepository;
import com.pcms.booking.service.BookingService;
import com.pcms.technician.entity.Technician;
import com.pcms.technician.entity.TechnicianStatus;
import com.pcms.technician.repository.TechnicianRepository;
import com.pcms.user.entity.User;
import com.pcms.user.repository.UserRepository;

import com.pcms.service.entity.PestService;
import com.pcms.service.repository.ServiceRepository;

@Service
public class BookingServiceImpl
        implements BookingService {

    private static final BigDecimal CONVENIENCE_FEE =
            BigDecimal.valueOf(49);

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final TechnicianRepository technicianRepository;
    private final ServiceRepository serviceRepository;

    public BookingServiceImpl(
            BookingRepository bookingRepository,
            UserRepository userRepository,
            TechnicianRepository technicianRepository,
            ServiceRepository serviceRepository) {

        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.technicianRepository = technicianRepository;
        this.serviceRepository = serviceRepository;
    }

    // =====================================================
    // CUSTOMER OPERATIONS
    // =====================================================

    @Override
    @Transactional
    public BookingResponse createBooking(
            String customerEmail,
            BookingRequest request) {

        User customer = findCustomerByEmail(
                customerEmail
        );

        BigDecimal servicePrice =
                getServicePrice(
                        request.getServiceName()
                );

        BigDecimal inspectionCharge =
                getInspectionCharge(
                        request.getServiceName(),
                        request.getServiceType()
                );

        BigDecimal totalAmount = servicePrice
                .add(inspectionCharge)
                .add(CONVENIENCE_FEE);

        Booking booking = Booking.builder()
                .customer(customer)
                .serviceName(
                        request.getServiceName().trim()
                )
                .serviceType(
                        request.getServiceType().trim()
                )
                .servicePrice(servicePrice)
                .inspectionCharge(inspectionCharge)
                .convenienceFee(CONVENIENCE_FEE)
                .totalAmount(totalAmount)
                .propertyType(
                        request.getPropertyType().trim()
                )
                .propertySize(
                        request.getPropertySize().trim()
                )
                .serviceAddress(
                        request.getServiceAddress().trim()
                )
                .landmark(
                        cleanOptional(
                                request.getLandmark()
                        )
                )
                .city(
                        request.getCity().trim()
                )
                .pincode(
                        request.getPincode().trim()
                )
                .preferredDate(
                        request.getPreferredDate()
                )
                .preferredTimeSlot(
                        request.getPreferredTimeSlot().trim()
                )
                .serviceFrequency(
                        request.getServiceFrequency().trim()
                )
                .pestType(
                        request.getPestType().trim()
                )
                .problemDescription(
                        request.getProblemDescription().trim()
                )
                
                .status(BookingStatus.PENDING)
                .build();

        Booking savedBooking =
                bookingRepository.save(booking);

        return convertToResponse(savedBooking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings(
            String customerEmail) {

        User customer = findCustomerByEmail(
                customerEmail
        );

        return bookingRepository
                .findByCustomerOrderByCreatedAtDesc(
                        customer
                )
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse getBookingById(
            Long bookingId,
            String customerEmail) {

        Booking booking =
                findBookingById(bookingId);

        String loggedInEmail =
                normalizeEmail(customerEmail);

        String bookingCustomerEmail =
                booking.getCustomer().getEmail();

        if (!bookingCustomerEmail.equalsIgnoreCase(
                loggedInEmail
        )) {

            throw new RuntimeException(
                    "You are not allowed to view this booking."
            );
        }

        return convertToResponse(booking);
    }

    // =====================================================
    // ADMIN OPERATIONS
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {

        return bookingRepository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getBookingsByStatus(
            BookingStatus status) {

        return bookingRepository
                .findByStatusOrderByCreatedAtDesc(
                        status
                )
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse getBookingByIdForAdmin(
            Long bookingId) {

        return convertToResponse(
                findBookingById(bookingId)
        );
    }

    @Override
    @Transactional
    public BookingResponse acceptBooking(
            Long bookingId) {

        Booking booking =
                findBookingById(bookingId);

        if (booking.getStatus()
                != BookingStatus.PENDING) {

            throw new RuntimeException(
                    "Only pending bookings can be accepted."
            );
        }

        booking.setStatus(
                BookingStatus.ACCEPTED
        );

        booking.setRejectionReason(null);

        Booking updatedBooking =
                bookingRepository.save(booking);

        return convertToResponse(
                updatedBooking
        );
    }

    @Override
    @Transactional
    public BookingResponse rejectBooking(
            Long bookingId,
            String rejectionReason) {

        Booking booking =
                findBookingById(bookingId);

        if (
            booking.getStatus()
                    != BookingStatus.PENDING
            &&
            booking.getStatus()
                    != BookingStatus.ACCEPTED
        ) {

            throw new RuntimeException(
                    "Only pending or accepted bookings can be rejected."
            );
        }

        if (booking.getTechnicianId() != null) {

            throw new RuntimeException(
                    "Booking cannot be rejected after technician assignment."
            );
        }

        if (rejectionReason == null
                || rejectionReason.isBlank()) {

            throw new RuntimeException(
                    "Rejection reason is required."
            );
        }

        booking.setStatus(
                BookingStatus.REJECTED
        );

        booking.setRejectionReason(
                rejectionReason.trim()
        );

        booking.setTechnicianId(null);
        booking.setTechnicianName(null);
        booking.setTechnicianPhone(null);

        Booking updatedBooking =
                bookingRepository.save(booking);

        return convertToResponse(
                updatedBooking
        );
    }

    @Override
    @Transactional
    public BookingResponse assignTechnician(
            Long bookingId,
            Long technicianId) {

        Booking booking =
                findBookingById(bookingId);

        if (booking.getStatus()
                != BookingStatus.ACCEPTED) {

            throw new RuntimeException(
                    "Technician can only be assigned to an accepted booking."
            );
        }

        Technician technician =
                findTechnicianById(technicianId);

        if (technician.getStatus()
                != TechnicianStatus.AVAILABLE) {

            throw new RuntimeException(
                    "Selected technician is not available."
            );
        }

        booking.setTechnicianId(
                technician.getId()
        );

        booking.setTechnicianName(
                technician.getFullName()
        );

        booking.setTechnicianPhone(
                technician.getPhone()
        );

        booking.setStatus(
                BookingStatus.ASSIGNED
        );

        booking.setRejectionReason(null);

        technician.setStatus(
                TechnicianStatus.BUSY
        );

        technicianRepository.save(technician);

        Booking updatedBooking =
                bookingRepository.save(booking);

        return convertToResponse(
                updatedBooking
        );
    }

    @Override
    @Transactional
    public BookingResponse startBooking(
            Long bookingId) {

        Booking booking =
                findBookingById(bookingId);

        if (booking.getStatus()
                != BookingStatus.ASSIGNED) {

            throw new RuntimeException(
                    "Only assigned bookings can be started."
            );
        }

        if (booking.getTechnicianId() == null) {
            throw new RuntimeException(
                    "No technician is assigned to this booking."
            );
        }

        booking.setStatus(
                BookingStatus.IN_PROGRESS
        );

        Booking updatedBooking =
                bookingRepository.save(booking);

        return convertToResponse(
                updatedBooking
        );
    }

    @Override
    @Transactional
    public BookingResponse completeBooking(
            Long bookingId) {

        Booking booking =
                findBookingById(bookingId);

        if (booking.getStatus()
                != BookingStatus.IN_PROGRESS) {

            throw new RuntimeException(
                    "Only in-progress bookings can be completed."
            );
        }

        if (booking.getTechnicianId() == null) {
            throw new RuntimeException(
                    "No technician is assigned to this booking."
            );
        }

        Technician technician =
                findTechnicianById(
                        booking.getTechnicianId()
                );

        booking.setStatus(
                BookingStatus.COMPLETED
        );

        technician.setStatus(
                TechnicianStatus.AVAILABLE
        );

        technicianRepository.save(technician);

        Booking updatedBooking =
                bookingRepository.save(booking);

        return convertToResponse(
                updatedBooking
        );
    }

    // =====================================================
    // HELPER METHODS
    // =====================================================

    private User findCustomerByEmail(
            String customerEmail) {

        String email =
                normalizeEmail(customerEmail);

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Customer not found."
                        )
                );
    }

    private Booking findBookingById(
            Long bookingId) {

        return bookingRepository
                .findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Booking not found."
                        )
                );
    }

    private Technician findTechnicianById(
            Long technicianId) {

        return technicianRepository
                .findById(technicianId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Technician not found."
                        )
                );
    }

    private String normalizeEmail(
            String email) {

        if (email == null || email.isBlank()) {
            throw new RuntimeException(
                    "Customer email is required."
            );
        }

        return email
                .trim()
                .toLowerCase();
    }

    private BigDecimal getServicePrice(
            String serviceName) {

        if (serviceName == null
                || serviceName.isBlank()) {

            throw new RuntimeException(
                    "Service name is required."
            );
        }

        PestService service =
                serviceRepository
                        .findByNameIgnoreCase(
                                serviceName.trim()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Selected service does not exist."
                                )
                        );

        if (!Boolean.TRUE.equals(
                service.getActive()
        )) {

            throw new RuntimeException(
                    "Selected service is currently unavailable."
            );
        }

        if (service.getPrice() == null) {
            throw new RuntimeException(
                    "Price is not configured for the selected service."
            );
        }

        return service.getPrice();
    }

    private BigDecimal getInspectionCharge(
            String serviceName,
            String serviceType) {

        String service = serviceName.trim();
        String type = serviceType.trim();

        if (service.equals("Termite Control")
                && type.equals(
                        "Inspection & Treatment"
                )) {

            return BigDecimal.valueOf(199);
        }

        if (service.equals(
                "General Pest Control"
        )
                && type.equals(
                        "Deep Treatment"
                )) {

            return BigDecimal.valueOf(149);
        }

        if (service.equals("Rodent Control")
                && (
                    type.equals(
                            "Trap Installation"
                    )
                    || type.equals(
                            "Baiting Treatment"
                    )
                )) {

            return BigDecimal.valueOf(99);
        }

        return BigDecimal.ZERO;
    }

    private String cleanOptional(
            String value) {

        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private BookingResponse convertToResponse(
            Booking booking) {

        User customer = booking.getCustomer();

        return BookingResponse.builder()
                .id(
                        booking.getId()
                )
                .customerName(
                        customer.getFullName()
                )
                .customerEmail(
                        customer.getEmail()
                )
                .customerPhone(
                        customer.getPhone()
                )
                .serviceName(
                        booking.getServiceName()
                )
                .serviceType(
                        booking.getServiceType()
                )
                .servicePrice(
                        booking.getServicePrice()
                )
                .inspectionCharge(
                        booking.getInspectionCharge()
                )
                .convenienceFee(
                        booking.getConvenienceFee()
                )
                .totalAmount(
                        booking.getTotalAmount()
                )
                .propertyType(
                        booking.getPropertyType()
                )
                .propertySize(
                        booking.getPropertySize()
                )
                .serviceAddress(
                        booking.getServiceAddress()
                )
                .landmark(
                        booking.getLandmark()
                )
                .city(
                        booking.getCity()
                )
                .pincode(
                        booking.getPincode()
                )
                .preferredDate(
                        booking.getPreferredDate()
                )
                .preferredTimeSlot(
                        booking.getPreferredTimeSlot()
                )
                .serviceFrequency(
                        booking.getServiceFrequency()
                )
                .pestType(
                        booking.getPestType()
                )
                .problemDescription(
                        booking.getProblemDescription()
                )
                .technicianId(
                        booking.getTechnicianId()
                )
                .technicianName(
                        booking.getTechnicianName()
                )
                .technicianPhone(
                        booking.getTechnicianPhone()
                )
                .status(
                        booking.getStatus()
                )
                .rejectionReason(
                        booking.getRejectionReason()
                )
                .createdAt(
                        booking.getCreatedAt()
                )
                .updatedAt(
                        booking.getUpdatedAt()
                )
                .build();
    }
}
package com.pcms.booking.service.impl;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.pcms.booking.dto.BookingRequest;
import com.pcms.booking.dto.BookingResponse;
import com.pcms.booking.entity.Booking;
import com.pcms.booking.entity.BookingStatus;
import com.pcms.booking.repository.BookingRepository;
import com.pcms.booking.service.BookingService;
import com.pcms.user.entity.User;
import com.pcms.user.repository.UserRepository;

@Service
public class BookingServiceImpl implements BookingService {

    private static final BigDecimal CONVENIENCE_FEE =
            BigDecimal.valueOf(49);

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public BookingServiceImpl(
            BookingRepository bookingRepository,
            UserRepository userRepository) {

        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }

    @Override
    public BookingResponse createBooking(
            String customerEmail,
            BookingRequest request) {

        User customer = userRepository
                .findByEmail(customerEmail.trim().toLowerCase())
                .orElseThrow(() ->
                        new RuntimeException("Customer not found.")
                );

        BigDecimal servicePrice =
                getServicePrice(request.getServiceName());

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
                .serviceName(request.getServiceName().trim())
                .serviceType(request.getServiceType().trim())
                .servicePrice(servicePrice)
                .inspectionCharge(inspectionCharge)
                .convenienceFee(CONVENIENCE_FEE)
                .totalAmount(totalAmount)
                .propertyType(request.getPropertyType().trim())
                .propertySize(request.getPropertySize().trim())
                .serviceAddress(request.getServiceAddress().trim())
                .landmark(cleanOptional(request.getLandmark()))
                .city(request.getCity().trim())
                .pincode(request.getPincode().trim())
                .preferredDate(request.getPreferredDate())
                .preferredTimeSlot(
                        request.getPreferredTimeSlot().trim()
                )
                .pestType(request.getPestType().trim())
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
    public List<BookingResponse> getMyBookings(
            String customerEmail) {

        User customer = userRepository
                .findByEmail(customerEmail.trim().toLowerCase())
                .orElseThrow(() ->
                        new RuntimeException("Customer not found.")
                );

        return bookingRepository
                .findByCustomerOrderByCreatedAtDesc(customer)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public BookingResponse getBookingById(
            Long bookingId,
            String customerEmail) {

        Booking booking = bookingRepository
                .findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found.")
                );

        if (!booking.getCustomer()
                .getEmail()
                .equalsIgnoreCase(customerEmail)) {

            throw new RuntimeException(
                    "You are not allowed to view this booking."
            );
        }

        return convertToResponse(booking);
    }

    private BigDecimal getServicePrice(
            String serviceName) {

        return switch (serviceName.trim()) {
            case "Termite Control" ->
                    BigDecimal.valueOf(1299);

            case "General Pest Control" ->
                    BigDecimal.valueOf(999);

            case "Cockroach Control" ->
                    BigDecimal.valueOf(799);

            case "Rodent Control" ->
                    BigDecimal.valueOf(899);

            case "Mosquito Control" ->
                    BigDecimal.valueOf(699);

            default ->
                    throw new RuntimeException(
                            "Invalid service selected."
                    );
        };
    }

    private BigDecimal getInspectionCharge(
            String serviceName,
            String serviceType) {

        String service = serviceName.trim();
        String type = serviceType.trim();

        if (service.equals("Termite Control")
                && type.equals("Inspection & Treatment")) {

            return BigDecimal.valueOf(199);
        }

        if (service.equals("General Pest Control")
                && type.equals("Deep Treatment")) {

            return BigDecimal.valueOf(149);
        }

        if (service.equals("Rodent Control")
                && (
                    type.equals("Trap Installation")
                    || type.equals("Baiting Treatment")
                )) {

            return BigDecimal.valueOf(99);
        }

        return BigDecimal.ZERO;
    }

    private String cleanOptional(String value) {

        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private BookingResponse convertToResponse(
            Booking booking) {

        return BookingResponse.builder()
                .id(booking.getId())
                .customerName(
                        booking.getCustomer().getFullName()
                )
                .serviceName(booking.getServiceName())
                .serviceType(booking.getServiceType())
                .servicePrice(booking.getServicePrice())
                .inspectionCharge(
                        booking.getInspectionCharge()
                )
                .convenienceFee(
                        booking.getConvenienceFee()
                )
                .totalAmount(booking.getTotalAmount())
                .propertyType(booking.getPropertyType())
                .propertySize(booking.getPropertySize())
                .serviceAddress(
                        booking.getServiceAddress()
                )
                .landmark(booking.getLandmark())
                .city(booking.getCity())
                .pincode(booking.getPincode())
                .preferredDate(
                        booking.getPreferredDate()
                )
                .preferredTimeSlot(
                        booking.getPreferredTimeSlot()
                )
                .pestType(booking.getPestType())
                .problemDescription(
                        booking.getProblemDescription()
                )
                .technicianName(
                        booking.getTechnicianName()
                )
                .technicianPhone(
                        booking.getTechnicianPhone()
                )
                .status(booking.getStatus())
                .rejectionReason(
                        booking.getRejectionReason()
                )
                .createdAt(booking.getCreatedAt())
                .build();
    }
}
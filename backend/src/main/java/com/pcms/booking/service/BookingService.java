package com.pcms.booking.service;

import java.util.List;

import com.pcms.booking.dto.BookingRequest;
import com.pcms.booking.dto.BookingResponse;
import com.pcms.booking.entity.BookingStatus;

public interface BookingService {

    // =========================
    // Customer operations
    // =========================

    BookingResponse createBooking(
            String customerEmail,
            BookingRequest request
    );

    List<BookingResponse> getMyBookings(
            String customerEmail
    );

    BookingResponse getBookingById(
            Long bookingId,
            String customerEmail
    );

    // =========================
    // Admin operations
    // =========================

    List<BookingResponse> getAllBookings();

    List<BookingResponse> getBookingsByStatus(
            BookingStatus status
    );

    BookingResponse getBookingByIdForAdmin(
            Long bookingId
    );

    BookingResponse acceptBooking(
            Long bookingId
    );

    BookingResponse rejectBooking(
            Long bookingId,
            String rejectionReason
    );

    BookingResponse assignTechnician(
            Long bookingId,
            Long technicianId
    );

    BookingResponse startBooking(
            Long bookingId
    );

    BookingResponse completeBooking(
            Long bookingId
    );
}
package com.pcms.booking.service;

import java.util.List;

import com.pcms.booking.dto.BookingRequest;
import com.pcms.booking.dto.BookingResponse;

public interface BookingService {

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
}
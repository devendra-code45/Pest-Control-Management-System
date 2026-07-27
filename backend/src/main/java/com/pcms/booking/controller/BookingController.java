package com.pcms.booking.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.pcms.booking.dto.BookingRequest;
import com.pcms.booking.dto.BookingResponse;
import com.pcms.booking.service.BookingService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/customer/bookings")
@Validated
public class BookingController {

    private final BookingService bookingService;

    public BookingController(
            BookingService bookingService) {

        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            Authentication authentication,
            @Valid @RequestBody BookingRequest request) {

        BookingResponse response =
                bookingService.createBooking(
                        authentication.getName(),
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<BookingResponse>>
            getMyBookings(
                    Authentication authentication) {

        List<BookingResponse> response =
                bookingService.getMyBookings(
                        authentication.getName()
                );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingResponse>
            getBookingById(
                    @PathVariable Long bookingId,
                    Authentication authentication) {

        BookingResponse response =
                bookingService.getBookingById(
                        bookingId,
                        authentication.getName()
                );

        return ResponseEntity.ok(response);
    }
}
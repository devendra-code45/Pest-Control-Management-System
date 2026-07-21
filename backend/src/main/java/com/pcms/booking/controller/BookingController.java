package com.pcms.booking.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pcms.booking.dto.BookingRequest;
import com.pcms.booking.dto.BookingResponse;
import com.pcms.booking.service.BookingService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<?> createBooking(
            @Valid @RequestBody BookingRequest request
    ) {
        try {
            BookingResponse response =
                    bookingService.createBooking(request);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);

        } catch (IllegalStateException exception) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            exception.getMessage()
                    ));
        }
    }

    @GetMapping
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(
                bookingService.getAllBookings()
        );
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingResponse> getBookingById(
            @PathVariable Long bookingId
    ) {
        return ResponseEntity.ok(
                bookingService.getBookingById(bookingId)
        );
    }
}
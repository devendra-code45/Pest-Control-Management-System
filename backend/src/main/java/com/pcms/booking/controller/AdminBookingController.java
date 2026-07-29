package com.pcms.booking.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pcms.booking.dto.BookingResponse;
import com.pcms.booking.dto.RejectBookingRequest;
import com.pcms.booking.entity.BookingStatus;
import com.pcms.booking.service.BookingService;
import com.pcms.technician.dto.AssignTechnicianRequest;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/bookings")
@Validated
public class AdminBookingController {

    private final BookingService bookingService;

    public AdminBookingController(
            BookingService bookingService) {

        this.bookingService = bookingService;
    }

    @GetMapping
    public ResponseEntity<List<BookingResponse>>
            getAllBookings() {

        return ResponseEntity.ok(
                bookingService.getAllBookings()
        );
    }

    @GetMapping("/pending")
    public ResponseEntity<List<BookingResponse>>
            getPendingBookings() {

        return ResponseEntity.ok(
                bookingService.getBookingsByStatus(
                        BookingStatus.PENDING
                )
        );
    }

    @GetMapping("/accepted")
    public ResponseEntity<List<BookingResponse>>
            getAcceptedBookings() {

        return ResponseEntity.ok(
                bookingService.getBookingsByStatus(
                        BookingStatus.ACCEPTED
                )
        );
    }

    @GetMapping("/assigned")
    public ResponseEntity<List<BookingResponse>>
            getAssignedBookings() {

        return ResponseEntity.ok(
                bookingService.getBookingsByStatus(
                        BookingStatus.ASSIGNED
                )
        );
    }

    @GetMapping("/in-progress")
    public ResponseEntity<List<BookingResponse>>
            getInProgressBookings() {

        return ResponseEntity.ok(
                bookingService.getBookingsByStatus(
                        BookingStatus.IN_PROGRESS
                )
        );
    }

    @GetMapping("/completed")
    public ResponseEntity<List<BookingResponse>>
            getCompletedBookings() {

        return ResponseEntity.ok(
                bookingService.getBookingsByStatus(
                        BookingStatus.COMPLETED
                )
        );
    }

    @GetMapping("/rejected")
    public ResponseEntity<List<BookingResponse>>
            getRejectedBookings() {

        return ResponseEntity.ok(
                bookingService.getBookingsByStatus(
                        BookingStatus.REJECTED
                )
        );
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingResponse>
            getBookingById(
                    @PathVariable Long bookingId) {

        return ResponseEntity.ok(
                bookingService.getBookingByIdForAdmin(
                        bookingId
                )
        );
    }

    @PutMapping("/{bookingId}/accept")
    public ResponseEntity<BookingResponse>
            acceptBooking(
                    @PathVariable Long bookingId) {

        return ResponseEntity.ok(
                bookingService.acceptBooking(
                        bookingId
                )
        );
    }

    @PutMapping("/{bookingId}/reject")
    public ResponseEntity<BookingResponse>
            rejectBooking(
                    @PathVariable Long bookingId,
                    @Valid
                    @RequestBody
                    RejectBookingRequest request) {

        return ResponseEntity.ok(
                bookingService.rejectBooking(
                        bookingId,
                        request.getRejectionReason()
                )
        );
    }

    @PutMapping("/{bookingId}/assign-technician")
    public ResponseEntity<BookingResponse>
            assignTechnician(
                    @PathVariable Long bookingId,
                    @Valid
                    @RequestBody
                    AssignTechnicianRequest request) {

        return ResponseEntity.ok(
                bookingService.assignTechnician(
                        bookingId,
                        request.getTechnicianId()
                )
        );
    }

    @PutMapping("/{bookingId}/start")
    public ResponseEntity<BookingResponse>
            startBooking(
                    @PathVariable Long bookingId) {

        return ResponseEntity.ok(
                bookingService.startBooking(
                        bookingId
                )
        );
    }

    @PutMapping("/{bookingId}/complete")
    public ResponseEntity<BookingResponse>
            completeBooking(
                    @PathVariable Long bookingId) {

        return ResponseEntity.ok(
                bookingService.completeBooking(
                        bookingId
                )
        );
    }
}
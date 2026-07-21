package com.pcms.booking.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pcms.booking.dto.BookingRequest;
import com.pcms.booking.dto.BookingResponse;
import com.pcms.booking.entity.Booking;
import com.pcms.booking.repository.BookingRepository;

@Service
@Transactional
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public BookingResponse createBooking(BookingRequest request) {

        boolean technicianAlreadyAssigned =
                bookingRepository.existsByTechnicianIdAndScheduleDateAndScheduleTime(
                        request.getTechnicianId(),
                        request.getScheduleDate(),
                        request.getScheduleTime()
                );

        if (technicianAlreadyAssigned) {
            throw new IllegalStateException(
                    "Technician is already assigned at the selected date and time"
            );
        }

        Booking booking = new Booking();

        booking.setCustomerId(request.getCustomerId());
        booking.setProperty(request.getProperty());
        booking.setServiceId(request.getServiceId());
        booking.setPestType(request.getPestType());
        booking.setPriority(request.getPriority().toUpperCase());
        booking.setScheduleDate(request.getScheduleDate());
        booking.setScheduleTime(request.getScheduleTime());
        booking.setTechnicianId(request.getTechnicianId());
        booking.setDuration(request.getDuration());
        booking.setAddress(request.getAddress());
        booking.setNotes(request.getNotes());
        booking.setStatus("PENDING");

        Booking savedBooking = bookingRepository.save(booking);

        return convertToResponse(savedBooking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Booking not found with ID: " + bookingId
                        )
                );

        return convertToResponse(booking);
    }

    private BookingResponse convertToResponse(Booking booking) {

        BookingResponse response = new BookingResponse();

        response.setBookingId(booking.getBookingId());
        response.setCustomerId(booking.getCustomerId());
        response.setProperty(booking.getProperty());
        response.setServiceId(booking.getServiceId());
        response.setPestType(booking.getPestType());
        response.setPriority(booking.getPriority());
        response.setScheduleDate(booking.getScheduleDate());
        response.setScheduleTime(booking.getScheduleTime());
        response.setTechnicianId(booking.getTechnicianId());
        response.setDuration(booking.getDuration());
        response.setAddress(booking.getAddress());
        response.setNotes(booking.getNotes());
        response.setStatus(booking.getStatus());
        response.setBookingDate(booking.getBookingDate());

        return response;
    }
}
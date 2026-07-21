package com.pcms.booking.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pcms.booking.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByCustomerId(Long customerId);

    List<Booking> findByTechnicianId(Long technicianId);

    List<Booking> findByScheduleDate(LocalDate scheduleDate);

    boolean existsByTechnicianIdAndScheduleDateAndScheduleTime(
            Long technicianId,
            LocalDate scheduleDate,
            java.time.LocalTime scheduleTime
    );
}
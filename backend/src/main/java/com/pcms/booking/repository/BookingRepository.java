package com.pcms.booking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pcms.booking.entity.Booking;
import com.pcms.booking.entity.BookingStatus;
import com.pcms.user.entity.User;

@Repository
public interface BookingRepository
        extends JpaRepository<Booking, Long> {

    List<Booking> findByCustomer(
            User customer
    );

    List<Booking> findByStatus(
            BookingStatus status
    );

    List<Booking> findByCustomerOrderByCreatedAtDesc(
            User customer
    );

    List<Booking> findByStatusOrderByCreatedAtDesc(
            BookingStatus status
    );

    List<Booking> findAllByOrderByCreatedAtDesc();
}
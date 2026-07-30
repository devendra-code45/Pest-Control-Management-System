package com.pcms.booking.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.pcms.booking.entity.Booking;
import com.pcms.booking.entity.BookingStatus;
import com.pcms.user.entity.User;

import jakarta.persistence.LockModeType;

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

    List<Booking> findByCustomerAndStatusInOrderByPreferredDateDesc(
            User customer,
            List<BookingStatus> statuses
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            select booking
            from Booking booking
            where booking.id = :bookingId
            """)
    Optional<Booking> findLockedById(
            @Param("bookingId") Long bookingId
    );
}
package com.pcms.payment.repository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.pcms.payment.entity.PaymentSchedule;
import com.pcms.payment.entity.PaymentScheduleStatus;

import jakarta.persistence.LockModeType;

@Repository
public interface PaymentScheduleRepository
        extends JpaRepository<PaymentSchedule, Long>,
        JpaSpecificationExecutor<PaymentSchedule> {

    Optional<PaymentSchedule> findByBookingId(Long bookingId);

    Optional<PaymentSchedule> findByBookingIdAndCustomerId(
            Long bookingId,
            Long customerId
    );

    List<PaymentSchedule> findByCustomerIdOrderByCreatedAtDesc(
            Long customerId
    );

    List<PaymentSchedule> findByStatusOrderByPaymentDueDateAsc(
            PaymentScheduleStatus status
    );

    List<PaymentSchedule> findByPaymentDueDateBeforeAndStatusIn(
            LocalDate paymentDueDate,
            Collection<PaymentScheduleStatus> statuses
    );

    boolean existsByBookingId(Long bookingId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            select paymentSchedule
            from PaymentSchedule paymentSchedule
            where paymentSchedule.id = :id
            """)
    Optional<PaymentSchedule> findByIdForUpdate(
            @Param("id") Long id
    );
}

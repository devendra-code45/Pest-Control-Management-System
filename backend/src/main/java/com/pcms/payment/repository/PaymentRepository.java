package com.pcms.payment.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.pcms.payment.entity.Payment;
import com.pcms.user.entity.User;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByBookingId(Long bookingId);
    boolean existsByBookingId(Long bookingId);
    List<Payment> findByCustomerOrderByCreatedAtDesc(User customer);
    List<Payment> findAllByOrderByCreatedAtDesc();
}

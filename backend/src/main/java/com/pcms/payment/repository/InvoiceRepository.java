package com.pcms.payment.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.pcms.payment.entity.Invoice;
import com.pcms.payment.entity.InvoiceStatus;

@Repository
public interface InvoiceRepository
        extends JpaRepository<Invoice, Long>,
        JpaSpecificationExecutor<Invoice> {

    @EntityGraph(attributePaths = "items")
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);

    @EntityGraph(attributePaths = "items")
    Optional<Invoice> findByBookingId(Long bookingId);

    List<Invoice> findByCustomerIdOrderByInvoiceDateDesc(
            Long customerId
    );

    List<Invoice> findByStatusOrderByInvoiceDateDesc(
            InvoiceStatus status
    );

    boolean existsByBookingId(Long bookingId);

    boolean existsByInvoiceNumber(String invoiceNumber);
}

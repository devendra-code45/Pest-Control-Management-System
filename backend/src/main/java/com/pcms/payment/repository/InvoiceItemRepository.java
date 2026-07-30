package com.pcms.payment.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pcms.payment.entity.InvoiceItem;

@Repository
public interface InvoiceItemRepository
        extends JpaRepository<InvoiceItem, Long> {

    List<InvoiceItem> findByInvoiceIdOrderBySortOrderAsc(
            Long invoiceId
    );
}

package com.pcms.payment.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.pcms.payment.entity.PaymentStatus;
import com.pcms.payment.entity.PaymentTransaction;
import com.pcms.payment.entity.PaymentVerificationStatus;

@Repository
public interface PaymentTransactionRepository
        extends JpaRepository<PaymentTransaction, Long>,
        JpaSpecificationExecutor<PaymentTransaction> {

    Optional<PaymentTransaction> findByTransactionId(
            String transactionId
    );

    Optional<PaymentTransaction> findByIdempotencyKey(
            String idempotencyKey
    );

    Optional<PaymentTransaction>
            findByGatewayProviderAndProviderPaymentId(
                    String gatewayProvider,
                    String providerPaymentId
            );

    Optional<PaymentTransaction> findByUtrNumber(
            String utrNumber
    );

    List<PaymentTransaction>
            findByPaymentScheduleIdOrderByCreatedAtDesc(
                    Long paymentScheduleId
            );

    List<PaymentTransaction>
            findByPaymentScheduleCustomerIdOrderByCreatedAtDesc(
                    Long customerId
            );

    List<PaymentTransaction>
            findByStatusOrderByCreatedAtDesc(
                    PaymentStatus status
            );

    List<PaymentTransaction>
            findByVerificationStatusOrderByCreatedAtAsc(
                    PaymentVerificationStatus verificationStatus
            );

    boolean existsByIdempotencyKey(String idempotencyKey);

    boolean existsByUtrNumber(String utrNumber);
}

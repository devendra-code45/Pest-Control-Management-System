package com.pcms.payment.service;

import java.util.List;

import com.pcms.payment.dto.PaymentRequest;
import com.pcms.payment.dto.PaymentResponse;
import com.pcms.payment.dto.RefundPaymentRequest;

public interface PaymentService {

    PaymentResponse makePayment(
            String email,
            PaymentRequest request
    );

    List<PaymentResponse> getMyPayments(
            String email
    );

    PaymentResponse getMyPayment(
            Long paymentId,
            String email
    );

    List<PaymentResponse> getAllPayments();

    PaymentResponse getPaymentForAdmin(
            Long paymentId
    );

    PaymentResponse refundPayment(
            Long paymentId,
            RefundPaymentRequest request
    );
}

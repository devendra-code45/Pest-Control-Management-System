package com.pcms.payment.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pcms.booking.entity.Booking;
import com.pcms.booking.entity.BookingStatus;
import com.pcms.booking.repository.BookingRepository;
import com.pcms.payment.dto.PaymentRequest;
import com.pcms.payment.dto.PaymentResponse;
import com.pcms.payment.dto.RefundPaymentRequest;
import com.pcms.payment.entity.Payment;
import com.pcms.payment.entity.PaymentStatus;
import com.pcms.payment.repository.PaymentRepository;
import com.pcms.payment.service.PaymentService;
import com.pcms.user.entity.User;
import com.pcms.user.repository.UserRepository;

@Service
public class PaymentServiceImpl
        implements PaymentService {

    private final PaymentRepository
            paymentRepository;

    private final BookingRepository
            bookingRepository;

    private final UserRepository
            userRepository;

    public PaymentServiceImpl(
            PaymentRepository paymentRepository,
            BookingRepository bookingRepository,
            UserRepository userRepository
    ) {
        this.paymentRepository =
                paymentRepository;

        this.bookingRepository =
                bookingRepository;

        this.userRepository =
                userRepository;
    }

    @Override
    @Transactional
    public PaymentResponse makePayment(
            String email,
            PaymentRequest request
    ) {
        User customer =
                findCustomer(email);

        Booking booking =
                bookingRepository
                        .findById(
                                request
                                        .getBookingId()
                        )
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Booking not found."
                                        )
                        );

        if (!booking
                .getCustomer()
                .getId()
                .equals(customer.getId())) {

            throw new RuntimeException(
                    "You are not allowed to pay for this booking."
            );
        }

        if (
                booking.getStatus()
                        == BookingStatus.REJECTED
                ||
                booking.getStatus()
                        == BookingStatus.CANCELLED
        ) {
            throw new RuntimeException(
                    "Payment is not allowed for a cancelled or rejected booking."
            );
        }

        if (
                paymentRepository
                        .existsByBookingId(
                                booking.getId()
                        )
        ) {
            throw new RuntimeException(
                    "Payment for this booking is already completed."
            );
        }

        Payment payment = new Payment();

        payment.setBooking(booking);
        payment.setCustomer(customer);
        payment.setAmount(
                booking.getTotalAmount()
        );
        payment.setPaymentMethod(
                request.getPaymentMethod()
        );
        payment.setStatus(
                PaymentStatus.PAID
        );
        payment.setTransactionId(
                generateTransactionId()
        );
        payment.setRefundedAmount(
                BigDecimal.ZERO
        );

        return toResponse(
                paymentRepository.save(
                        payment
                )
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse>
            getMyPayments(
                    String email
            ) {

        User customer =
                findCustomer(email);

        return paymentRepository
                .findByCustomerOrderByCreatedAtDesc(
                        customer
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponse getMyPayment(
            Long paymentId,
            String email
    ) {
        User customer =
                findCustomer(email);

        Payment payment =
                findPayment(paymentId);

        if (!payment
                .getCustomer()
                .getId()
                .equals(customer.getId())) {

            throw new RuntimeException(
                    "You are not allowed to view this payment."
            );
        }

        return toResponse(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse>
            getAllPayments() {

        return paymentRepository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponse
            getPaymentForAdmin(
                    Long paymentId
            ) {

        return toResponse(
                findPayment(paymentId)
        );
    }

    @Override
    @Transactional
    public PaymentResponse refundPayment(
            Long paymentId,
            RefundPaymentRequest request
    ) {
        Payment payment =
                findPayment(paymentId);

        if (
                payment.getStatus()
                        == PaymentStatus.REFUNDED
        ) {
            throw new RuntimeException(
                    "This payment has already been refunded."
            );
        }

        if (
                payment.getStatus()
                        != PaymentStatus.PAID
        ) {
            throw new RuntimeException(
                    "Only a successful paid transaction can be refunded."
            );
        }

        BigDecimal refundAmount =
                request.getAmount();

        if (
                refundAmount.compareTo(
                        payment.getAmount()
                ) != 0
        ) {
            throw new RuntimeException(
                    "Only a full refund is supported. Refund amount must equal the paid amount."
            );
        }

        payment.setStatus(
                PaymentStatus.REFUNDED
        );

        payment.setRefundedAmount(
                payment.getAmount()
        );

        payment.setRefundReason(
                request
                        .getReason()
                        .trim()
        );

        String note =
                request.getNote();

        payment.setRefundNote(
                note == null ||
                        note.isBlank()
                        ? null
                        : note.trim()
        );

        payment.setRefundedAt(
                LocalDateTime.now()
        );

        return toResponse(
                paymentRepository.save(
                        payment
                )
        );
    }

    private User findCustomer(
            String email
    ) {
        return userRepository
                .findByEmail(
                        email
                                .trim()
                                .toLowerCase()
                )
                .orElseThrow(
                        () ->
                                new RuntimeException(
                                        "Customer not found."
                                )
                );
    }

    private Payment findPayment(
            Long paymentId
    ) {
        return paymentRepository
                .findById(paymentId)
                .orElseThrow(
                        () ->
                                new RuntimeException(
                                        "Payment not found."
                                )
                );
    }

    private String generateTransactionId() {
        return "TXN-" +
                UUID.randomUUID()
                        .toString()
                        .replace("-", "")
                        .substring(0, 16)
                        .toUpperCase();
    }

    private PaymentResponse toResponse(
            Payment payment
    ) {
        Booking booking =
                payment.getBooking();

        User customer =
                payment.getCustomer();

        PaymentResponse response =
                new PaymentResponse();

        response.setId(payment.getId());
        response.setBookingId(booking.getId());
        response.setBookingNumber(
                "BK-" +
                        String.format(
                                "%04d",
                                booking.getId()
                        )
        );
        response.setCustomerId(customer.getId());
        response.setCustomerName(
                customer.getFullName()
        );
        response.setCustomerEmail(
                customer.getEmail()
        );
        response.setCustomerPhone(
                customer.getPhone()
        );
        response.setCustomerAddress(
                customer.getAddress()
        );
        response.setServiceName(
                booking.getServiceName()
        );
        response.setServiceType(
                booking.getServiceType()
        );
        response.setServiceAmount(
                booking.getServicePrice()
        );
        response.setInspectionCharge(
                booking.getInspectionCharge()
        );
        response.setConvenienceFee(
                booking.getConvenienceFee()
        );
        response.setAmount(payment.getAmount());
        response.setPropertyType(
                booking.getPropertyType()
        );
        response.setServiceAddress(
                booking.getServiceAddress()
        );
        response.setCity(booking.getCity());
        response.setPreferredDate(
                booking.getPreferredDate()
        );
        response.setTechnicianName(
                booking.getTechnicianName()
        );
        response.setBookingStatus(
                booking.getStatus()
        );
        response.setPaymentMethod(
                payment.getPaymentMethod()
        );
        response.setStatus(payment.getStatus());
        response.setTransactionId(
                payment.getTransactionId()
        );
        response.setRefundedAmount(
                payment.getRefundedAmount()
        );
        response.setRefundReason(
                payment.getRefundReason()
        );
        response.setRefundNote(
                payment.getRefundNote()
        );
        response.setRefundedAt(
                payment.getRefundedAt()
        );
        response.setCreatedAt(
                payment.getCreatedAt()
        );
        response.setUpdatedAt(
                payment.getUpdatedAt()
        );

        return response;
    }

}
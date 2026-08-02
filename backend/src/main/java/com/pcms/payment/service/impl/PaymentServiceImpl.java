package com.pcms.payment.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import com.pcms.booking.entity.Booking;
import com.pcms.booking.entity.BookingStatus;
import com.pcms.booking.repository.BookingRepository;
import com.pcms.notification.entity.NotificationType;
import com.pcms.notification.service.NotificationService;
import com.pcms.payment.dto.PaymentRequest;
import com.pcms.payment.dto.PaymentResponse;
import com.pcms.payment.dto.RefundPaymentRequest;
import com.pcms.payment.entity.Payment;
import com.pcms.payment.entity.PaymentStatus;
import com.pcms.payment.repository.PaymentRepository;
import com.pcms.payment.service.PaymentEmailService;
import com.pcms.payment.service.PaymentService;
import com.pcms.user.entity.User;
import com.pcms.user.repository.UserRepository;

@Service
public class PaymentServiceImpl
        implements PaymentService {

    private static final Logger LOGGER =
            LoggerFactory.getLogger(
                    PaymentServiceImpl.class
            );

    private final PaymentRepository
            paymentRepository;

    private final BookingRepository
            bookingRepository;

    private final UserRepository
            userRepository;

    private final PaymentEmailService
            paymentEmailService;

    private final NotificationService
            notificationService;

    public PaymentServiceImpl(
            PaymentRepository paymentRepository,
            BookingRepository bookingRepository,
            UserRepository userRepository,
            PaymentEmailService paymentEmailService,
            NotificationService notificationService
    ) {
        this.paymentRepository =
                paymentRepository;

        this.bookingRepository =
                bookingRepository;

        this.userRepository =
                userRepository;

        this.paymentEmailService =
                paymentEmailService;

        this.notificationService =
                notificationService;
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

        Payment savedPayment =
                paymentRepository.save(
                        payment
                );

        PaymentResponse response =
                toResponse(savedPayment);

        schedulePaymentEmailsAfterCommit(
                customer,
                booking,
                savedPayment,
                response.getBookingNumber()
        );

        return response;
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

        Payment savedPayment =
                paymentRepository.save(
                        payment
                );

        PaymentResponse response =
                toResponse(savedPayment);

        scheduleRefundEmailsAfterCommit(
                savedPayment,
                response.getBookingNumber()
        );

        return response;
    }

    private void scheduleRefundEmailsAfterCommit(
            Payment payment,
            String bookingNumber
    ) {
        User customer =
                payment.getCustomer();

        Booking booking =
                payment.getBooking();

        String customerEmail =
                customer.getEmail();

        String customerName =
                customer.getFullName();

        String serviceName =
                booking.getServiceName();

        BigDecimal refundedAmount =
                payment.getRefundedAmount();

        String transactionId =
                payment.getTransactionId();

        String refundReason =
                payment.getRefundReason();

        String refundNote =
                payment.getRefundNote();

        LocalDateTime refundedAt =
                payment.getRefundedAt();

        Long bookingId =
                booking.getId();

        Long paymentId =
                payment.getId();

        Runnable emailTask = () -> {
            paymentEmailService
                    .sendRefundNotifications(
                            customerEmail,
                            customerName,
                            bookingNumber,
                            serviceName,
                            refundedAmount,
                            transactionId,
                            refundReason,
                            refundNote,
                            refundedAt
                    );

            try {
                notificationService
                        .createCustomerNotification(
                                customerEmail,
                                "Refund Processed",
                                "Your refund of INR " +
                                        refundedAmount +
                                        " for booking " +
                                        bookingNumber +
                                        " has been processed.",
                                NotificationType
                                        .REFUND_PROCESSED,
                                bookingId,
                                paymentId
                        );

                notificationService
                        .createAdminNotification(
                                "Refund Completed",
                                "Refund of INR " +
                                        refundedAmount +
                                        " was completed for " +
                                        customerName +
                                        " (" +
                                        bookingNumber +
                                        ").",
                                NotificationType
                                        .REFUND_COMPLETED,
                                bookingId,
                                paymentId
                        );
            } catch (RuntimeException exception) {
                LOGGER.error(
                        "Unable to create refund notifications for payment {}.",
                        paymentId,
                        exception
                );
            }
        };

        if (
                TransactionSynchronizationManager
                        .isSynchronizationActive()
        ) {
            TransactionSynchronizationManager
                    .registerSynchronization(
                            new TransactionSynchronization() {
                                @Override
                                public void afterCommit() {
                                    emailTask.run();
                                }
                            }
                    );
        } else {
            emailTask.run();
        }
    }

    private void schedulePaymentEmailsAfterCommit(
            User customer,
            Booking booking,
            Payment payment,
            String bookingNumber
    ) {
        String customerEmail =
                customer.getEmail();

        String customerName =
                customer.getFullName();

        String serviceName =
                booking.getServiceName();

        BigDecimal amount =
                payment.getAmount();

        String transactionId =
                payment.getTransactionId();

        String paymentMethod =
                String.valueOf(
                        payment.getPaymentMethod()
                );

        Long bookingId =
                booking.getId();

        Long paymentId =
                payment.getId();

        Runnable emailTask = () -> {
            paymentEmailService
                    .sendPaymentNotifications(
                            customerEmail,
                            customerName,
                            bookingNumber,
                            serviceName,
                            amount,
                            transactionId,
                            paymentMethod
                    );

            try {
                notificationService
                        .createCustomerNotification(
                                customerEmail,
                                "Payment Successful",
                                "Your payment of INR " +
                                        amount +
                                        " for booking " +
                                        bookingNumber +
                                        " was completed successfully.",
                                NotificationType
                                        .PAYMENT_SUCCESS,
                                bookingId,
                                paymentId
                        );

                notificationService
                        .createAdminNotification(
                                "Payment Received",
                                "Payment of INR " +
                                        amount +
                                        " was received from " +
                                        customerName +
                                        " for booking " +
                                        bookingNumber +
                                        ".",
                                NotificationType
                                        .PAYMENT_RECEIVED,
                                bookingId,
                                paymentId
                        );
            } catch (RuntimeException exception) {
                LOGGER.error(
                        "Unable to create payment notifications for payment {}.",
                        paymentId,
                        exception
                );
            }
        };

        if (
                TransactionSynchronizationManager
                        .isSynchronizationActive()
        ) {
            TransactionSynchronizationManager
                    .registerSynchronization(
                            new TransactionSynchronization() {
                                @Override
                                public void afterCommit() {
                                    emailTask.run();
                                }
                            }
                    );
        } else {
            emailTask.run();
        }
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
package com.pcms.payment.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pcms.payment.dto.PaymentResponse;
import com.pcms.payment.dto.RefundPaymentRequest;
import com.pcms.payment.service.PaymentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/payments")
public class AdminPaymentController {

    private final PaymentService paymentService;

    public AdminPaymentController(
            PaymentService paymentService
    ) {
        this.paymentService =
                paymentService;
    }

    @GetMapping
    public ResponseEntity<List<PaymentResponse>>
            getAll() {

        return ResponseEntity.ok(
                paymentService
                        .getAllPayments()
        );
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<PaymentResponse>
            getOne(
                    @PathVariable
                    Long paymentId
            ) {

        return ResponseEntity.ok(
                paymentService
                        .getPaymentForAdmin(
                                paymentId
                        )
        );
    }

    @PatchMapping("/{paymentId}/refund")
    public ResponseEntity<PaymentResponse>
            refund(
                    @PathVariable
                    Long paymentId,
                    @Valid
                    @RequestBody
                    RefundPaymentRequest request
            ) {

        return ResponseEntity.ok(
                paymentService
                        .refundPayment(
                                paymentId,
                                request
                        )
        );
    }
}

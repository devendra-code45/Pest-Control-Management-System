package com.pcms.payment.controller;

import java.util.List;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.pcms.payment.dto.*;
import com.pcms.payment.service.PaymentService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/customer/payments")
public class CustomerPaymentController {
    private final PaymentService paymentService;
    public CustomerPaymentController(PaymentService paymentService) { this.paymentService = paymentService; }

    @PostMapping
    public ResponseEntity<PaymentResponse> makePayment(Authentication auth, @Valid @RequestBody PaymentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentService.makePayment(auth.getName(), request));
    }
    @GetMapping
    public ResponseEntity<List<PaymentResponse>> getMyPayments(Authentication auth) {
        return ResponseEntity.ok(paymentService.getMyPayments(auth.getName()));
    }
    @GetMapping("/{paymentId}")
    public ResponseEntity<PaymentResponse> getPayment(@PathVariable Long paymentId, Authentication auth) {
        return ResponseEntity.ok(paymentService.getMyPayment(paymentId, auth.getName()));
    }
}

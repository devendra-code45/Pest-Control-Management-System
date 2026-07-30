package com.pcms.payment.entity;

public enum PaymentStatus {

    CREATED,

    PENDING,

    PENDING_VERIFICATION,

    AUTHORIZED,

    PAID,

    FAILED,

    CANCELLED,

    PARTIALLY_REFUNDED,

    REFUNDED
}

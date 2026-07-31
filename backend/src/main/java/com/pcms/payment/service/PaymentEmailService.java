package com.pcms.payment.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.text.DecimalFormat;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class PaymentEmailService {

    private static final Logger LOGGER =
            LoggerFactory.getLogger(
                    PaymentEmailService.class
            );

    private final JavaMailSender mailSender;
    private final String senderEmail;
    private final String adminEmail;

    public PaymentEmailService(
            JavaMailSender mailSender,
            @Value("${spring.mail.username}")
            String senderEmail,
            @Value("${pcms.admin.email}")
            String adminEmail
    ) {
        this.mailSender = mailSender;
        this.senderEmail = senderEmail;
        this.adminEmail = adminEmail;
    }

    public void sendPaymentNotifications(
            String customerEmail,
            String customerName,
            String bookingNumber,
            String serviceName,
            BigDecimal amount,
            String transactionId,
            String paymentMethod
    ) {
        sendCustomerPaymentEmail(
                customerEmail,
                customerName,
                bookingNumber,
                serviceName,
                amount,
                transactionId,
                paymentMethod
        );

        sendAdminPaymentEmail(
                customerEmail,
                customerName,
                bookingNumber,
                serviceName,
                amount,
                transactionId,
                paymentMethod
        );
    }

    private void sendCustomerPaymentEmail(
            String customerEmail,
            String customerName,
            String bookingNumber,
            String serviceName,
            BigDecimal amount,
            String transactionId,
            String paymentMethod
    ) {
        String subject =
                "Payment Successful - " +
                        bookingNumber;

        String html = String.format(
                "<div style='font-family:Arial,sans-serif;max-width:620px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden'>"
                        + "<div style='background:#15803d;color:#ffffff;padding:22px 26px'>"
                        + "<h2 style='margin:0'>Payment Successful</h2>"
                        + "<p style='margin:7px 0 0'>Pest Control Management System</p>"
                        + "</div>"
                        + "<div style='padding:24px 26px;color:#1f2937'>"
                        + "<p>Hello <strong>%s</strong>,</p>"
                        + "<p>Your payment has been completed successfully.</p>"
                        + "<div style='background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px;margin:20px 0'>"
                        + "<div style='color:#166534;font-size:14px'>Amount Debited</div>"
                        + "<div style='color:#15803d;font-size:25px;font-weight:700;margin-top:4px'>%s</div>"
                        + "</div>"
                        + "<table style='width:100%%;border-collapse:collapse;font-size:14px'>"
                        + "<tr><td style='padding:8px 0;color:#64748b'>Booking ID</td><td style='padding:8px 0;text-align:right;font-weight:600'>%s</td></tr>"
                        + "<tr><td style='padding:8px 0;color:#64748b'>Service</td><td style='padding:8px 0;text-align:right;font-weight:600'>%s</td></tr>"
                        + "<tr><td style='padding:8px 0;color:#64748b'>Transaction ID</td><td style='padding:8px 0;text-align:right;font-weight:600'>%s</td></tr>"
                        + "<tr><td style='padding:8px 0;color:#64748b'>Payment Method</td><td style='padding:8px 0;text-align:right;font-weight:600'>%s</td></tr>"
                        + "<tr><td style='padding:8px 0;color:#64748b'>Status</td><td style='padding:8px 0;text-align:right;color:#15803d;font-weight:700'>PAID</td></tr>"
                        + "</table>"
                        + "<p style='margin-top:24px;color:#64748b;font-size:13px'>This is an automatically generated payment notification.</p>"
                        + "</div></div>",
                escapeHtml(customerName),
                formatAmount(amount),
                escapeHtml(bookingNumber),
                escapeHtml(serviceName),
                escapeHtml(transactionId),
                escapeHtml(paymentMethod)
        );

        sendHtmlEmail(
                customerEmail,
                subject,
                html,
                "customer"
        );
    }

    private void sendAdminPaymentEmail(
            String customerEmail,
            String customerName,
            String bookingNumber,
            String serviceName,
            BigDecimal amount,
            String transactionId,
            String paymentMethod
    ) {
        String subject =
                "Payment Received - " +
                        bookingNumber;

        String html = String.format(
                "<div style='font-family:Arial,sans-serif;max-width:620px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden'>"
                        + "<div style='background:#166534;color:#ffffff;padding:22px 26px'>"
                        + "<h2 style='margin:0'>Payment Received</h2>"
                        + "<p style='margin:7px 0 0'>Admin payment notification</p>"
                        + "</div>"
                        + "<div style='padding:24px 26px;color:#1f2937'>"
                        + "<p>A customer payment has been received successfully.</p>"
                        + "<div style='background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px;margin:20px 0'>"
                        + "<div style='color:#166534;font-size:14px'>Amount Credited</div>"
                        + "<div style='color:#15803d;font-size:25px;font-weight:700;margin-top:4px'>%s</div>"
                        + "</div>"
                        + "<table style='width:100%%;border-collapse:collapse;font-size:14px'>"
                        + "<tr><td style='padding:8px 0;color:#64748b'>Customer</td><td style='padding:8px 0;text-align:right;font-weight:600'>%s</td></tr>"
                        + "<tr><td style='padding:8px 0;color:#64748b'>Customer Email</td><td style='padding:8px 0;text-align:right;font-weight:600'>%s</td></tr>"
                        + "<tr><td style='padding:8px 0;color:#64748b'>Booking ID</td><td style='padding:8px 0;text-align:right;font-weight:600'>%s</td></tr>"
                        + "<tr><td style='padding:8px 0;color:#64748b'>Service</td><td style='padding:8px 0;text-align:right;font-weight:600'>%s</td></tr>"
                        + "<tr><td style='padding:8px 0;color:#64748b'>Transaction ID</td><td style='padding:8px 0;text-align:right;font-weight:600'>%s</td></tr>"
                        + "<tr><td style='padding:8px 0;color:#64748b'>Payment Method</td><td style='padding:8px 0;text-align:right;font-weight:600'>%s</td></tr>"
                        + "<tr><td style='padding:8px 0;color:#64748b'>Status</td><td style='padding:8px 0;text-align:right;color:#15803d;font-weight:700'>PAID</td></tr>"
                        + "</table>"
                        + "</div></div>",
                formatAmount(amount),
                escapeHtml(customerName),
                escapeHtml(customerEmail),
                escapeHtml(bookingNumber),
                escapeHtml(serviceName),
                escapeHtml(transactionId),
                escapeHtml(paymentMethod)
        );

        sendHtmlEmail(
                adminEmail,
                subject,
                html,
                "admin"
        );
    }

    private void sendHtmlEmail(
            String recipient,
            String subject,
            String html,
            String recipientType
    ) {
        try {
            MimeMessage message =
                    mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(
                            message,
                            false,
                            StandardCharsets.UTF_8.name()
                    );

            helper.setFrom(senderEmail);
            helper.setTo(recipient);
            helper.setSubject(subject);
            helper.setText(html, true);

            mailSender.send(message);
        } catch (Exception exception) {
            LOGGER.error(
                    "Unable to send payment email to {} recipient {}.",
                    recipientType,
                    recipient,
                    exception
            );
        }
    }

    private String formatAmount(
            BigDecimal amount
    ) {
        BigDecimal safeAmount =
                amount == null
                        ? BigDecimal.ZERO
                        : amount.setScale(
                                2,
                                RoundingMode.HALF_UP
                        );

        DecimalFormat formatter =
                new DecimalFormat(
                        "#,##0.00"
                );

        return "INR " +
                formatter.format(
                        safeAmount
                );
    }

    private String escapeHtml(
            String value
    ) {
        if (value == null) {
            return "Not available";
        }

        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
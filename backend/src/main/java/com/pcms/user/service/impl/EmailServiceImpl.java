package com.pcms.user.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.pcms.user.service.EmailService;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    public EmailServiceImpl(
            JavaMailSender mailSender) {

        this.mailSender = mailSender;
    }

    @Override
    public void sendPasswordResetOtp(
            String recipientEmail,
            String otp) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setFrom(senderEmail);
        message.setTo(recipientEmail);
        message.setSubject(
                "Pest Control Password Reset OTP"
        );

        message.setText(
                "Hello,\n\n"
                + "Your password reset OTP is: "
                + otp
                + "\n\n"
                + "This OTP is valid for 10 minutes."
                + "\n\n"
                + "Do not share this OTP with anyone."
                + "\n\n"
                + "Regards,\n"
                + "Pest Control Management System"
        );

        mailSender.send(message);
    }
}
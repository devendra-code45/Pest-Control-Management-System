package com.pcms.notification.service;

import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.pcms.notification.dto.NotificationResponse;
import com.pcms.notification.entity.Notification;
import com.pcms.notification.entity.NotificationType;
import com.pcms.notification.repository.NotificationRepository;
import com.pcms.user.entity.Role;
import com.pcms.user.entity.User;
import com.pcms.user.repository.UserRepository;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(
            NotificationRepository notificationRepository,
            UserRepository userRepository
    ) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getMyNotifications(String email) {
        User user = findUser(email);

        List<Notification> notifications;

        if (user.getRole() == Role.ADMIN) {
            notifications =
                    notificationRepository
                            .findTop20ByRecipientRoleOrderByCreatedAtDesc(
                                    Role.ADMIN
                            );
        } else if (user.getRole() == Role.CUSTOMER) {
            notifications =
                    notificationRepository
                            .findTop20ByRecipientRoleAndRecipientEmailOrderByCreatedAtDesc(
                                    Role.CUSTOMER,
                                    normalizeEmail(email)
                            );
        } else {
            notifications = Collections.emptyList();
        }

        return notifications
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public long getMyUnreadCount(String email) {
        User user = findUser(email);

        if (user.getRole() == Role.ADMIN) {
            return notificationRepository
                    .countByRecipientRoleAndReadStatusFalse(
                            Role.ADMIN
                    );
        }

        if (user.getRole() == Role.CUSTOMER) {
            return notificationRepository
                    .countByRecipientRoleAndRecipientEmailAndReadStatusFalse(
                            Role.CUSTOMER,
                            normalizeEmail(email)
                    );
        }

        return 0L;
    }

    @Transactional
    public NotificationResponse markAsRead(
            Long notificationId,
            String email
    ) {
        User user = findUser(email);

        Notification notification;

        if (user.getRole() == Role.ADMIN) {
            notification =
                    notificationRepository
                            .findByIdAndRecipientRole(
                                    notificationId,
                                    Role.ADMIN
                            )
                            .orElseThrow(
                                    () -> new RuntimeException(
                                            "Notification not found."
                                    )
                            );
        } else if (user.getRole() == Role.CUSTOMER) {
            notification =
                    notificationRepository
                            .findByIdAndRecipientRoleAndRecipientEmail(
                                    notificationId,
                                    Role.CUSTOMER,
                                    normalizeEmail(email)
                            )
                            .orElseThrow(
                                    () -> new RuntimeException(
                                            "Notification not found."
                                    )
                            );
        } else {
            throw new RuntimeException(
                    "Notifications are not available for this role."
            );
        }

        if (!notification.isReadStatus()) {
            notification.setReadStatus(true);
            notification =
                    notificationRepository.save(notification);
        }

        return toResponse(notification);
    }

    @Transactional
    public void markAllAsRead(String email) {
        User user = findUser(email);

        List<Notification> notifications;

        if (user.getRole() == Role.ADMIN) {
            notifications =
                    notificationRepository
                            .findByRecipientRoleAndReadStatusFalse(
                                    Role.ADMIN
                            );
        } else if (user.getRole() == Role.CUSTOMER) {
            notifications =
                    notificationRepository
                            .findByRecipientRoleAndRecipientEmailAndReadStatusFalse(
                                    Role.CUSTOMER,
                                    normalizeEmail(email)
                            );
        } else {
            return;
        }

        notifications.forEach(
                notification ->
                        notification.setReadStatus(true)
        );

        notificationRepository.saveAll(notifications);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void createCustomerNotification(
            String customerEmail,
            String title,
            String message,
            NotificationType type,
            Long relatedBookingId,
            Long relatedPaymentId
    ) {
        Notification notification = new Notification();

        notification.setRecipientRole(Role.CUSTOMER);
        notification.setRecipientEmail(
                normalizeEmail(customerEmail)
        );
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setReadStatus(false);
        notification.setRelatedBookingId(
                relatedBookingId
        );
        notification.setRelatedPaymentId(
                relatedPaymentId
        );

        notificationRepository.save(notification);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void createAdminNotification(
            String title,
            String message,
            NotificationType type,
            Long relatedBookingId,
            Long relatedPaymentId
    ) {
        Notification notification = new Notification();

        notification.setRecipientRole(Role.ADMIN);
        notification.setRecipientEmail(null);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setReadStatus(false);
        notification.setRelatedBookingId(
                relatedBookingId
        );
        notification.setRelatedPaymentId(
                relatedPaymentId
        );

        notificationRepository.save(notification);
    }

    private User findUser(String email) {
        return userRepository
                .findByEmail(normalizeEmail(email))
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found."
                        )
                );
    }

    private String normalizeEmail(String email) {
        if (email == null) {
            throw new RuntimeException(
                    "User email is required."
            );
        }

        return email.trim().toLowerCase();
    }

    private NotificationResponse toResponse(
            Notification notification
    ) {
        NotificationResponse response =
                new NotificationResponse();

        response.setId(notification.getId());
        response.setTitle(notification.getTitle());
        response.setMessage(
                notification.getMessage()
        );
        response.setType(notification.getType());
        response.setRead(
                notification.isReadStatus()
        );
        response.setRelatedBookingId(
                notification.getRelatedBookingId()
        );
        response.setRelatedPaymentId(
                notification.getRelatedPaymentId()
        );
        response.setCreatedAt(
                notification.getCreatedAt()
        );

        return response;
    }
}

package com.pcms.notification.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pcms.notification.entity.Notification;
import com.pcms.user.entity.Role;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification>
            findTop20ByRecipientRoleAndRecipientEmailOrderByCreatedAtDesc(
                    Role recipientRole,
                    String recipientEmail
            );

    List<Notification>
            findTop20ByRecipientRoleOrderByCreatedAtDesc(
                    Role recipientRole
            );

    long countByRecipientRoleAndRecipientEmailAndReadStatusFalse(
            Role recipientRole,
            String recipientEmail
    );

    long countByRecipientRoleAndReadStatusFalse(
            Role recipientRole
    );

    Optional<Notification>
            findByIdAndRecipientRoleAndRecipientEmail(
                    Long id,
                    Role recipientRole,
                    String recipientEmail
            );

    Optional<Notification>
            findByIdAndRecipientRole(
                    Long id,
                    Role recipientRole
            );

    List<Notification>
            findByRecipientRoleAndRecipientEmailAndReadStatusFalse(
                    Role recipientRole,
                    String recipientEmail
            );

    List<Notification>
            findByRecipientRoleAndReadStatusFalse(
                    Role recipientRole
            );
}

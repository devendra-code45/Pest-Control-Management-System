package com.pcms.notification.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pcms.notification.dto.NotificationResponse;
import com.pcms.notification.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(
            NotificationService notificationService
    ) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponse>>
            getMyNotifications(
                    Authentication authentication
            ) {

        return ResponseEntity.ok(
                notificationService
                        .getMyNotifications(
                                authentication.getName()
                        )
        );
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>>
            getMyUnreadCount(
                    Authentication authentication
            ) {

        long count =
                notificationService
                        .getMyUnreadCount(
                                authentication.getName()
                        );

        return ResponseEntity.ok(
                Map.of("count", count)
        );
    }

    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<NotificationResponse>
            markAsRead(
                    @PathVariable
                    Long notificationId,
                    Authentication authentication
            ) {

        return ResponseEntity.ok(
                notificationService
                        .markAsRead(
                                notificationId,
                                authentication.getName()
                        )
        );
    }

    @PatchMapping("/read-all")
    public ResponseEntity<Void>
            markAllAsRead(
                    Authentication authentication
            ) {

        notificationService
                .markAllAsRead(
                        authentication.getName()
                );

        return ResponseEntity.noContent()
                .build();
    }
}

package com.pcms.complaint.entity;

import java.util.Arrays;

public enum ComplaintCategory {
    SERVICE_QUALITY("Service Quality"),
    SERVICE_DELAY("Service Delay"),
    TECHNICIAN_BEHAVIOUR("Technician Behaviour"),
    PAYMENT_ISSUE("Payment Issue"),
    RESCHEDULE("Reschedule"),
    PEST_PROBLEM_NOT_RESOLVED("Pest Problem Not Resolved"),
    FOLLOW_UP("Follow Up"),
    OTHER("Other");

    private final String displayName;

    ComplaintCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static ComplaintCategory fromValue(String value) {
        if (value == null || value.isBlank()) {
            throw new RuntimeException("Complaint category is required.");
        }

        String normalized = value.trim().replace("Behavior", "Behaviour");

        return Arrays.stream(values())
                .filter(item ->
                        item.name().equalsIgnoreCase(normalized.replace(" ", "_"))
                                || item.displayName.equalsIgnoreCase(normalized))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Invalid complaint category."));
    }
}

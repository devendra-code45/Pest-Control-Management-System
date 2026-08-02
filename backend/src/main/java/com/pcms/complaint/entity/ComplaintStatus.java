package com.pcms.complaint.entity;

import java.util.Arrays;

public enum ComplaintStatus {
    PENDING("Pending"),
    IN_PROGRESS("In Progress"),
    RESOLVED("Resolved"),
    CLOSED("Closed"),
    REJECTED("Rejected");

    private final String displayName;

    ComplaintStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static ComplaintStatus fromValue(String value) {
        if (value == null || value.isBlank()) {
            throw new RuntimeException("Complaint status is required.");
        }

        String normalized = value.trim();

        return Arrays.stream(values())
                .filter(item ->
                        item.name().equalsIgnoreCase(normalized.replace(" ", "_"))
                                || item.displayName.equalsIgnoreCase(normalized))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Invalid complaint status."));
    }
}

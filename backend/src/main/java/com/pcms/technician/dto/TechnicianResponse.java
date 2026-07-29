package com.pcms.technician.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.pcms.technician.entity.TechnicianStatus;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class TechnicianResponse {

    private Long id;

    private String fullName;

    private String email;

    private String phone;

    private String address;

    private String specialization;

    private Integer experienceYears;

    private LocalDate dateOfBirth;

    private String gender;

    private String profilePhoto;

    private String emergencyContact;

    private String emergencyContactName;

    private String emergencyContactPhone;

    private String emergencyContactRelationship;

    private TechnicianStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
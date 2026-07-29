package com.pcms.technician.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pcms.technician.dto.TechnicianRequest;
import com.pcms.technician.dto.TechnicianResponse;
import com.pcms.technician.entity.Technician;
import com.pcms.technician.entity.TechnicianStatus;
import com.pcms.technician.repository.TechnicianRepository;
import com.pcms.technician.service.TechnicianService;

@Service
public class TechnicianServiceImpl
        implements TechnicianService {

    private final TechnicianRepository technicianRepository;

    public TechnicianServiceImpl(
            TechnicianRepository technicianRepository) {

        this.technicianRepository = technicianRepository;
    }

    @Override
    @Transactional
    public TechnicianResponse addTechnician(
            TechnicianRequest request) {

        String email = normalizeEmail(
                request.getEmail()
        );

        String phone = request
                .getPhone()
                .trim();

        String emergencyPhone =
                resolveEmergencyPhone(request);

        validateDuplicateEmail(
                email,
                null
        );

        validateDuplicatePhone(
                phone,
                null
        );

        Technician technician = Technician.builder()
                .fullName(
                        request.getFullName().trim()
                )
                .email(email)
                .phone(phone)
                .address(
                        request.getAddress().trim()
                )
                .specialization(
                        request.getSpecialization().trim()
                )
                .experienceYears(
                        request.getExperienceYears()
                )
                .dateOfBirth(
                        request.getDateOfBirth()
                )
                .gender(
                        request.getGender().trim()
                )
                .profilePhoto(
                        normalizeNullable(
                                request.getProfilePhoto()
                        )
                )
                .emergencyContact(
                        emergencyPhone
                )
                .emergencyContactName(
                        normalizeNullable(
                                request.getEmergencyContactName()
                        )
                )
                .emergencyContactPhone(
                        emergencyPhone
                )
                .emergencyContactRelationship(
                        normalizeNullable(
                                request.getEmergencyContactRelationship()
                        )
                )
                .status(
                        TechnicianStatus.AVAILABLE
                )
                .build();

        Technician savedTechnician =
                technicianRepository.save(
                        technician
                );

        return convertToResponse(
                savedTechnician
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<TechnicianResponse>
            getAllTechnicians() {

        return technicianRepository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TechnicianResponse>
            getAvailableTechnicians() {

        return technicianRepository
                .findByStatusOrderByFullNameAsc(
                        TechnicianStatus.AVAILABLE
                )
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TechnicianResponse getTechnicianById(
            Long technicianId) {

        Technician technician =
                findTechnicianById(
                        technicianId
                );

        return convertToResponse(
                technician
        );
    }

    @Override
    @Transactional
    public TechnicianResponse updateTechnician(
            Long technicianId,
            TechnicianRequest request) {

        Technician technician =
                findTechnicianById(
                        technicianId
                );

        String email = normalizeEmail(
                request.getEmail()
        );

        String phone = request
                .getPhone()
                .trim();

        String emergencyPhone =
                resolveEmergencyPhone(request);

        validateDuplicateEmail(
                email,
                technicianId
        );

        validateDuplicatePhone(
                phone,
                technicianId
        );

        technician.setFullName(
                request.getFullName().trim()
        );

        technician.setEmail(email);

        technician.setPhone(phone);

        technician.setAddress(
                request.getAddress().trim()
        );

        technician.setSpecialization(
                request.getSpecialization().trim()
        );

        technician.setExperienceYears(
                request.getExperienceYears()
        );

        technician.setDateOfBirth(
                request.getDateOfBirth()
        );

        technician.setGender(
                request.getGender().trim()
        );

        technician.setProfilePhoto(
                normalizeNullable(
                        request.getProfilePhoto()
                )
        );

        technician.setEmergencyContact(
                emergencyPhone
        );

        technician.setEmergencyContactPhone(
                emergencyPhone
        );

        technician.setEmergencyContactName(
                normalizeNullable(
                        request.getEmergencyContactName()
                )
        );

        technician.setEmergencyContactRelationship(
                normalizeNullable(
                        request.getEmergencyContactRelationship()
                )
        );

        Technician updatedTechnician =
                technicianRepository.save(
                        technician
                );

        return convertToResponse(
                updatedTechnician
        );
    }

    @Override
    @Transactional
    public TechnicianResponse activateTechnician(
            Long technicianId) {

        Technician technician =
                findTechnicianById(
                        technicianId
                );

        if (technician.getStatus()
                == TechnicianStatus.BUSY) {

            throw new RuntimeException(
                    "Busy technician cannot be activated manually."
            );
        }

        technician.setStatus(
                TechnicianStatus.AVAILABLE
        );

        Technician updatedTechnician =
                technicianRepository.save(
                        technician
                );

        return convertToResponse(
                updatedTechnician
        );
    }

    @Override
    @Transactional
    public TechnicianResponse deactivateTechnician(
            Long technicianId) {

        Technician technician =
                findTechnicianById(
                        technicianId
                );

        if (technician.getStatus()
                == TechnicianStatus.BUSY) {

            throw new RuntimeException(
                    "Busy technician cannot be deactivated."
            );
        }

        technician.setStatus(
                TechnicianStatus.INACTIVE
        );

        Technician updatedTechnician =
                technicianRepository.save(
                        technician
                );

        return convertToResponse(
                updatedTechnician
        );
    }

    private Technician findTechnicianById(
            Long technicianId) {

        return technicianRepository
                .findById(technicianId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Technician not found."
                        )
                );
    }

    private void validateDuplicateEmail(
            String email,
            Long currentTechnicianId) {

        technicianRepository
                .findByEmailIgnoreCase(email)
                .ifPresent(existing -> {

                    boolean belongsToAnother =
                            currentTechnicianId == null
                            || !existing.getId()
                                    .equals(
                                            currentTechnicianId
                                    );

                    if (belongsToAnother) {
                        throw new RuntimeException(
                                "Email is already registered."
                        );
                    }
                });
    }

    private void validateDuplicatePhone(
            String phone,
            Long currentTechnicianId) {

        technicianRepository
                .findByPhone(phone)
                .ifPresent(existing -> {

                    boolean belongsToAnother =
                            currentTechnicianId == null
                            || !existing.getId()
                                    .equals(
                                            currentTechnicianId
                                    );

                    if (belongsToAnother) {
                        throw new RuntimeException(
                                "Phone number is already registered."
                        );
                    }
                });
    }

    private String normalizeEmail(
            String email) {

        return email
                .trim()
                .toLowerCase();
    }

    private String normalizeNullable(
            String value) {

        if (value == null) {
            return null;
        }

        String normalized = value.trim();

        return normalized.isEmpty()
                ? null
                : normalized;
    }

    private String resolveEmergencyPhone(
            TechnicianRequest request) {

        String newPhone = normalizeNullable(
                request.getEmergencyContactPhone()
        );

        if (newPhone != null) {
            return newPhone;
        }

        String legacyPhone = normalizeNullable(
                request.getEmergencyContact()
        );

        if (legacyPhone != null) {
            return legacyPhone;
        }

        throw new RuntimeException(
                "Emergency contact number is required."
        );
    }

    private TechnicianResponse convertToResponse(
            Technician technician) {

        String emergencyPhone =
                technician.getEmergencyContactPhone() != null
                        ? technician.getEmergencyContactPhone()
                        : technician.getEmergencyContact();

        return TechnicianResponse.builder()
                .id(
                        technician.getId()
                )
                .fullName(
                        technician.getFullName()
                )
                .email(
                        technician.getEmail()
                )
                .phone(
                        technician.getPhone()
                )
                .address(
                        technician.getAddress()
                )
                .specialization(
                        technician.getSpecialization()
                )
                .experienceYears(
                        technician.getExperienceYears()
                )
                .dateOfBirth(
                        technician.getDateOfBirth()
                )
                .gender(
                        technician.getGender()
                )
                .profilePhoto(
                        technician.getProfilePhoto()
                )
                .emergencyContact(
                        emergencyPhone
                )
                .emergencyContactName(
                        technician.getEmergencyContactName()
                )
                .emergencyContactPhone(
                        emergencyPhone
                )
                .emergencyContactRelationship(
                        technician.getEmergencyContactRelationship()
                )
                .status(
                        technician.getStatus()
                )
                .createdAt(
                        technician.getCreatedAt()
                )
                .updatedAt(
                        technician.getUpdatedAt()
                )
                .build();
    }
}
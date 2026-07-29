package com.pcms.technician.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "technicians")
public class Technician {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            nullable = false,
            length = 100
    )
    private String fullName;

    @Column(
            nullable = false,
            unique = true,
            length = 150
    )
    private String email;

    @Column(
            nullable = false,
            unique = true,
            length = 15
    )
    private String phone;

    @Column(
            nullable = false,
            length = 500
    )
    private String address;

    @Column(
            nullable = false,
            length = 100
    )
    private String specialization;

    @Column(nullable = false)
    private Integer experienceYears;

    @Column(nullable = true)
    private LocalDate dateOfBirth;

    @Column(
            nullable = true,
            length = 20
    )
    private String gender;

    @Lob
    @Column(
            name = "profile_photo",
            columnDefinition = "LONGTEXT"
    )
    private String profilePhoto;

    @Column(
            nullable = true,
            length = 15
    )
    private String emergencyContact;

    @Column(
            nullable = true,
            length = 100
    )
    private String emergencyContactName;

    @Column(
            nullable = true,
            length = 15
    )
    private String emergencyContactPhone;

    @Column(
            nullable = true,
            length = 50
    )
    private String emergencyContactRelationship;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TechnicianStatus status;

    @Column(
            nullable = false,
            updatable = false
    )
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public Technician() {
    }

    @PrePersist
    public void beforeInsert() {
        LocalDateTime now = LocalDateTime.now();

        createdAt = now;
        updatedAt = now;

        if (status == null) {
            status = TechnicianStatus.AVAILABLE;
        }
    }

    @PreUpdate
    public void beforeUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {

        private final Technician technician =
                new Technician();

        public Builder fullName(String fullName) {
            technician.setFullName(fullName);
            return this;
        }

        public Builder email(String email) {
            technician.setEmail(email);
            return this;
        }

        public Builder phone(String phone) {
            technician.setPhone(phone);
            return this;
        }

        public Builder address(String address) {
            technician.setAddress(address);
            return this;
        }

        public Builder specialization(
                String specialization) {

            technician.setSpecialization(
                    specialization
            );

            return this;
        }

        public Builder experienceYears(
                Integer experienceYears) {

            technician.setExperienceYears(
                    experienceYears
            );

            return this;
        }

        public Builder dateOfBirth(
                LocalDate dateOfBirth) {

            technician.setDateOfBirth(
                    dateOfBirth
            );

            return this;
        }

        public Builder gender(String gender) {
            technician.setGender(gender);
            return this;
        }

        public Builder profilePhoto(
                String profilePhoto) {

            technician.setProfilePhoto(
                    profilePhoto
            );

            return this;
        }

        public Builder emergencyContact(
                String emergencyContact) {

            technician.setEmergencyContact(
                    emergencyContact
            );

            return this;
        }

        public Builder emergencyContactName(
                String emergencyContactName) {

            technician.setEmergencyContactName(
                    emergencyContactName
            );

            return this;
        }

        public Builder emergencyContactPhone(
                String emergencyContactPhone) {

            technician.setEmergencyContactPhone(
                    emergencyContactPhone
            );

            return this;
        }

        public Builder emergencyContactRelationship(
                String relationship) {

            technician
                    .setEmergencyContactRelationship(
                            relationship
                    );

            return this;
        }

        public Builder status(
                TechnicianStatus status) {

            technician.setStatus(status);
            return this;
        }

        public Technician build() {
            return technician;
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(
            String fullName) {

        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(
            String email) {

        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(
            String phone) {

        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(
            String address) {

        this.address = address;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(
            String specialization) {

        this.specialization =
                specialization;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(
            Integer experienceYears) {

        this.experienceYears =
                experienceYears;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(
            LocalDate dateOfBirth) {

        this.dateOfBirth =
                dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(
            String gender) {

        this.gender = gender;
    }

    public String getProfilePhoto() {
        return profilePhoto;
    }

    public void setProfilePhoto(
            String profilePhoto) {

        this.profilePhoto =
                profilePhoto;
    }

    public String getEmergencyContact() {
        return emergencyContact;
    }

    public void setEmergencyContact(
            String emergencyContact) {

        this.emergencyContact =
                emergencyContact;
    }

    public String getEmergencyContactName() {
        return emergencyContactName;
    }

    public void setEmergencyContactName(
            String emergencyContactName) {

        this.emergencyContactName =
                emergencyContactName;
    }

    public String getEmergencyContactPhone() {
        return emergencyContactPhone;
    }

    public void setEmergencyContactPhone(
            String emergencyContactPhone) {

        this.emergencyContactPhone =
                emergencyContactPhone;
    }

    public String
            getEmergencyContactRelationship() {

        return emergencyContactRelationship;
    }

    public void
            setEmergencyContactRelationship(
                    String relationship) {

        this.emergencyContactRelationship =
                relationship;
    }

    public TechnicianStatus getStatus() {
        return status;
    }

    public void setStatus(
            TechnicianStatus status) {

        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(
            LocalDateTime createdAt) {

        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(
            LocalDateTime updatedAt) {

        this.updatedAt = updatedAt;
    }
}
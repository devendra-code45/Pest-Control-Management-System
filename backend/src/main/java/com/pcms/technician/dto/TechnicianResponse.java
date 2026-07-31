package com.pcms.technician.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.pcms.technician.entity.TechnicianStatus;

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

    public TechnicianResponse() {
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {

        private final TechnicianResponse response =
                new TechnicianResponse();

        public Builder id(Long id) {
            response.setId(id);
            return this;
        }

        public Builder fullName(String fullName) {
            response.setFullName(fullName);
            return this;
        }

        public Builder email(String email) {
            response.setEmail(email);
            return this;
        }

        public Builder phone(String phone) {
            response.setPhone(phone);
            return this;
        }

        public Builder address(String address) {
            response.setAddress(address);
            return this;
        }

        public Builder specialization(
                String specialization) {

            response.setSpecialization(
                    specialization
            );

            return this;
        }

        public Builder experienceYears(
                Integer experienceYears) {

            response.setExperienceYears(
                    experienceYears
            );

            return this;
        }

        public Builder dateOfBirth(
                LocalDate dateOfBirth) {

            response.setDateOfBirth(
                    dateOfBirth
            );

            return this;
        }

        public Builder gender(String gender) {
            response.setGender(gender);
            return this;
        }

        public Builder profilePhoto(
                String profilePhoto) {

            response.setProfilePhoto(
                    profilePhoto
            );

            return this;
        }

        public Builder emergencyContact(
                String emergencyContact) {

            response.setEmergencyContact(
                    emergencyContact
            );

            return this;
        }

        public Builder emergencyContactName(
                String emergencyContactName) {

            response.setEmergencyContactName(
                    emergencyContactName
            );

            return this;
        }

        public Builder emergencyContactPhone(
                String emergencyContactPhone) {

            response.setEmergencyContactPhone(
                    emergencyContactPhone
            );

            return this;
        }

        public Builder emergencyContactRelationship(
                String relationship) {

            response.setEmergencyContactRelationship(
                    relationship
            );

            return this;
        }

        public Builder status(
                TechnicianStatus status) {

            response.setStatus(status);
            return this;
        }

        public Builder createdAt(
                LocalDateTime createdAt) {

            response.setCreatedAt(createdAt);
            return this;
        }

        public Builder updatedAt(
                LocalDateTime updatedAt) {

            response.setUpdatedAt(updatedAt);
            return this;
        }

        public TechnicianResponse build() {
            return response;
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

        this.dateOfBirth = dateOfBirth;
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

        this.profilePhoto = profilePhoto;
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
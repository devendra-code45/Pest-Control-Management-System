package com.pcms.user.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(
            nullable = false,
            unique = true
    )
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(
            nullable = false,
            unique = true
    )
    private String phone;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private String gender;

    private String address;

    private String city;

    private String pincode;

    private String profileImage;

    @Column(nullable = false)
    private boolean active = true;

    public User() {
    }

    public User(
            Long id,
            String fullName,
            String email,
            String password,
            String phone,
            LocalDate dateOfBirth,
            Role role,
            String gender,
            String address,
            String city,
            String pincode,
            String profileImage,
            boolean active) {

        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.dateOfBirth = dateOfBirth;
        this.role = role;
        this.gender = gender;
        this.address = address;
        this.city = city;
        this.pincode = pincode;
        this.profileImage = profileImage;
        this.active = active;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {

        private final User user =
                new User();

        public Builder id(Long id) {
            user.setId(id);
            return this;
        }

        public Builder fullName(
                String fullName) {

            user.setFullName(fullName);
            return this;
        }

        public Builder email(
                String email) {

            user.setEmail(email);
            return this;
        }

        public Builder password(
                String password) {

            user.setPassword(password);
            return this;
        }

        public Builder phone(
                String phone) {

            user.setPhone(phone);
            return this;
        }

        public Builder dateOfBirth(
                LocalDate dateOfBirth) {

            user.setDateOfBirth(
                    dateOfBirth
            );

            return this;
        }

        public Builder role(
                Role role) {

            user.setRole(role);
            return this;
        }

        public Builder gender(
                String gender) {

            user.setGender(gender);
            return this;
        }

        public Builder address(
                String address) {

            user.setAddress(address);
            return this;
        }

        public Builder city(
                String city) {

            user.setCity(city);
            return this;
        }

        public Builder pincode(
                String pincode) {

            user.setPincode(pincode);
            return this;
        }

        public Builder profileImage(
                String profileImage) {

            user.setProfileImage(
                    profileImage
            );

            return this;
        }

        public Builder active(
                boolean active) {

            user.setActive(active);
            return this;
        }

        public User build() {
            return user;
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(
            Long id) {

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

    public String getPassword() {
        return password;
    }

    public void setPassword(
            String password) {

        this.password = password;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(
            String phone) {

        this.phone = phone;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(
            LocalDate dateOfBirth) {

        this.dateOfBirth = dateOfBirth;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(
            Role role) {

        this.role = role;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(
            String gender) {

        this.gender = gender;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(
            String address) {

        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(
            String city) {

        this.city = city;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(
            String pincode) {

        this.pincode = pincode;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(
            String profileImage) {

        this.profileImage =
                profileImage;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(
            boolean active) {

        this.active = active;
    }
}
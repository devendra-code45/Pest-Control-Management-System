package com.pcms.user.dto;

import java.time.LocalDate;

import com.pcms.user.entity.Role;

public class UserResponse {

    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private Role role;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private String city;
    private String pincode;
    private String profileImage;

    public UserResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(
            Long id
    ) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(
            String fullName
    ) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(
            String email
    ) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(
            String phone
    ) {
        this.phone = phone;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(
            Role role
    ) {
        this.role = role;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(
            LocalDate dateOfBirth
    ) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(
            String gender
    ) {
        this.gender = gender;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(
            String address
    ) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(
            String city
    ) {
        this.city = city;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(
            String pincode
    ) {
        this.pincode = pincode;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(
            String profileImage
    ) {
        this.profileImage = profileImage;
    }
}
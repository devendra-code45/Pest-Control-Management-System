package com.pcms.user.dto;

import java.time.LocalDate;

import com.pcms.user.entity.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank(
            message = "Full name is required"
    )
    @Size(
            max = 100,
            message = "Full name cannot exceed 100 characters"
    )
    private String fullName;

    @NotBlank(
            message = "Email is required"
    )
    @Email(
            message = "Enter a valid email address"
    )
    private String email;

    @NotBlank(
            message = "Phone number is required"
    )
    @Pattern(
            regexp = "^[6-9][0-9]{9}$",
            message = "Enter a valid 10-digit phone number"
    )
    private String phone;

    @NotNull(
            message = "Date of birth is required"
    )
    @Past(
            message = "Date of birth must be in the past"
    )
    private LocalDate dateOfBirth;

    @NotBlank(
            message = "Gender is required"
    )
    @Pattern(
            regexp = "^(Male|Female|Other)$",
            message = "Select a valid gender"
    )
    private String gender;

    @NotBlank(
            message = "Address is required"
    )
    @Size(
            max = 500,
            message = "Address cannot exceed 500 characters"
    )
    private String address;

    @NotBlank(
            message = "City is required"
    )
    @Size(
            max = 100,
            message = "City cannot exceed 100 characters"
    )
    private String city;

    @NotBlank(
            message = "Pincode is required"
    )
    @Pattern(
            regexp = "^[0-9]{6}$",
            message = "Pincode must contain 6 digits"
    )
    private String pincode;

    @NotBlank(
            message = "Password is required"
    )
    @Size(
            min = 6,
            message = "Password must be at least 6 characters"
    )
    private String password;

    private Role role;

    public RegisterRequest() {
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

    public String getPassword() {
        return password;
    }

    public void setPassword(
            String password) {

        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(
            Role role) {

        this.role = role;
    }
}
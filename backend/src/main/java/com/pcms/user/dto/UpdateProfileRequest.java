package com.pcms.user.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be 10 digits")
    private String phone;

    private String gender;

    private LocalDate dateOfBirth;

    @Size(max = 255)
    private String address;

    @Size(max = 100)
    private String city;

    @Pattern(regexp = "^[0-9]{6}$", message = "Invalid pincode")
    private String pincode;
}
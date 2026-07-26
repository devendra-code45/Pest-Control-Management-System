package com.pcms.user.dto;

import com.pcms.user.entity.Role;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserResponse {

    private Long id;

    private String fullName;

    private String email;

    private String phone;

    private Role role;

    private String address;

    private String city;

    private String pincode;

    private String profileImage;
}
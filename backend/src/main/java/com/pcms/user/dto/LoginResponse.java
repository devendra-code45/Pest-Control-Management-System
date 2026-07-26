package com.pcms.user.dto;

import com.pcms.user.entity.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private Long id;

    private String fullName;

    private String email;

    private String token;

    private Role role;

}
package com.pcms.user.service;

import com.pcms.user.dto.LoginRequest;
import com.pcms.user.dto.LoginResponse;
import com.pcms.user.dto.RegisterRequest;
import com.pcms.user.dto.UserResponse;
import com.pcms.user.dto.UpdateProfileRequest;
import com.pcms.user.dto.ChangePasswordRequest;

public interface UserService {

    UserResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

    UserResponse getProfile(String email);

    UserResponse updateProfile(
            String email,
            UpdateProfileRequest request
    );

    void changePassword(
            String email,
            ChangePasswordRequest request
    );
}
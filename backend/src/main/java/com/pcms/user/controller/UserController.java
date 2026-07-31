package com.pcms.user.controller;

import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.pcms.user.dto.RegisterRequest;
import com.pcms.user.dto.UserResponse;
import com.pcms.user.service.UserService;

import jakarta.validation.Valid;

import com.pcms.user.dto.LoginRequest;
import com.pcms.user.dto.LoginResponse;


import org.springframework.security.core.Authentication;

import com.pcms.user.dto.UpdateProfileRequest;
import com.pcms.user.dto.ChangePasswordRequest;

import org.springframework.web.bind.annotation.RequestBody;




@RestController
@RequestMapping("/api/users")
@Validated
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        UserResponse response = userService.register(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(response);
    }
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid
            @RequestBody
            LoginRequest request) {

        return ResponseEntity.ok(
                userService.login(request)
        );
    }
    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getProfile(
            Authentication authentication) {

        UserResponse response = userService.getProfile(
                authentication.getName()
        );

        return ResponseEntity.ok(response);
    }
    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request) {

        UserResponse response = userService.updateProfile(
                authentication.getName(),
                request
        );

        return ResponseEntity.ok(response);
    }
    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {

        userService.changePassword(
                authentication.getName(),
                request
        );

        return ResponseEntity.ok(
                "Password changed successfully."
        );
    }

}
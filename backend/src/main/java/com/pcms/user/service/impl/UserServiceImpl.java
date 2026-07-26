package com.pcms.user.service.impl;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;

import com.pcms.security.jwt.JwtService;
import com.pcms.user.dto.LoginRequest;
import com.pcms.user.dto.LoginResponse;
import com.pcms.user.dto.RegisterRequest;
import com.pcms.user.dto.UserResponse;
import com.pcms.user.entity.Role;
import com.pcms.user.entity.User;
import com.pcms.user.repository.UserRepository;
import com.pcms.user.service.UserService;
import com.pcms.user.dto.UpdateProfileRequest;
import com.pcms.user.dto.ChangePasswordRequest;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public UserResponse register(RegisterRequest request) {

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        String phone = request.getPhone().trim();

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists.");
        }

        if (userRepository.existsByPhone(phone)) {
            throw new RuntimeException("Phone number already exists.");
        }

        Role role = request.getRole() == null
                ? Role.CUSTOMER
                : request.getRole();

        User user = User.builder()
                .fullName(request.getFullName().trim())
                .email(email)
                .phone(phone)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .active(true)
                .build();

        User savedUser = userRepository.save(user);

        return convertToResponse(savedUser);
    }

    @Override
    public LoginResponse login(LoginRequest request) {

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password."));

        if (!user.isActive()) {
            throw new RuntimeException("Your account is inactive.");
        }

        boolean passwordMatches = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        );

        if (!passwordMatches) {
            throw new RuntimeException("Invalid email or password.");
        }

        String token = jwtService.generateToken(user.getEmail());

        return LoginResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .token(token)
                .build();
    }

    @Override
    public UserResponse getProfile(String email) {

        User user = userRepository
                .findByEmail(email.trim().toLowerCase())
                .orElseThrow(() ->
                        new RuntimeException("User not found.")
                );

        return convertToResponse(user);
    }

    @Override
    public UserResponse updateProfile(
            String email,
            UpdateProfileRequest request) {

        User user = userRepository
                .findByEmail(email.trim().toLowerCase())
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        User userWithSamePhone = userRepository
                .findByPhone(request.getPhone().trim())
                .orElse(null);

        if (userWithSamePhone != null
                && !userWithSamePhone.getId().equals(user.getId())) {

            throw new RuntimeException(
                    "Phone number already exists."
            );
        }

        user.setFullName(request.getFullName().trim());
        user.setPhone(request.getPhone().trim());
        user.setGender(request.getGender());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setAddress(request.getAddress());
        user.setCity(request.getCity());
        user.setPincode(request.getPincode());

        User updatedUser = userRepository.save(user);

        return convertToResponse(updatedUser);
    }

    @Override
    public void changePassword(
            String email,
            ChangePasswordRequest request) {

        User user = userRepository
                .findByEmail(email.trim().toLowerCase())
                .orElseThrow(() ->
                        new RuntimeException("User not found.")
                );

        if (!passwordEncoder.matches(
                request.getOldPassword(),
                user.getPassword())) {

            throw new RuntimeException(
                    "Old password is incorrect."
            );
        }

        if (!request.getNewPassword()
                .equals(request.getConfirmPassword())) {

            throw new RuntimeException(
                    "New password and confirm password do not match."
            );
        }

        if (passwordEncoder.matches(
                request.getNewPassword(),
                user.getPassword())) {

            throw new RuntimeException(
                    "New password must be different from old password."
            );
        }

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        userRepository.save(user);
    }

    private UserResponse convertToResponse(User user) {

        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .address(user.getAddress())
                .city(user.getCity())
                .pincode(user.getPincode())
                .profileImage(user.getProfileImage())
                .build();
    }
}
package com.pcms.security.oauth;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.pcms.security.jwt.JwtService;
import com.pcms.user.entity.User;
import com.pcms.user.repository.UserRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class GoogleOAuth2SuccessHandler
        implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public GoogleOAuth2SuccessHandler(
            UserRepository userRepository,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication)
            throws IOException, ServletException {

        OAuth2User googleUser =
                (OAuth2User) authentication.getPrincipal();

        String email =
                googleUser.getAttribute("email");

        if (email == null || email.isBlank()) {

            response.sendRedirect(
                    "http://localhost:5173/login?error=google_email_missing"
            );

            return;
        }

        email = email.trim().toLowerCase();

        User user = userRepository
                .findByEmail(email)
                .orElse(null);

        /*
         * Google account must already exist
         * in the PCMS database.
         */
        if (user == null) {

            response.sendRedirect(
                    "http://localhost:5173/login?error=google_account_not_registered"
            );

            return;
        }

        /*
         * Do not allow inactive users.
         */
        if (!user.isActive()) {

            response.sendRedirect(
                    "http://localhost:5173/login?error=account_inactive"
            );

            return;
        }

        /*
         * Generate the same JWT used
         * by normal email/password login.
         */
        String token =
                jwtService.generateToken(
                        user.getEmail()
                );

        String encodedToken =
                URLEncoder.encode(
                        token,
                        StandardCharsets.UTF_8
                );

        String encodedRole =
                URLEncoder.encode(
                        user.getRole().name(),
                        StandardCharsets.UTF_8
                );

        String encodedName =
                URLEncoder.encode(
                        user.getFullName(),
                        StandardCharsets.UTF_8
                );

        /*
         * Redirect back to React.
         */
        String redirectUrl =
                "http://localhost:5173/login"
                + "?googleLogin=success"
                + "&token=" + encodedToken
                + "&role=" + encodedRole
                + "&name=" + encodedName;

        response.sendRedirect(redirectUrl);
    }
}
package com.pcms.security.jwt;

import java.io.IOException;
import java.util.Set;

import org.springframework.security.authentication
        .UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context
        .SecurityContextHolder;
import org.springframework.security.core.userdetails
        .UserDetails;
import org.springframework.security.web.authentication
        .WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter
        .OncePerRequestFilter;

import com.pcms.security.CustomUserDetailsService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private static final Set<String>
            PUBLIC_ENDPOINTS = Set.of(

            "/api/users/register",
            "/api/users/login",
            "/api/users/forgot-password",
            "/api/users/verify-otp",
            "/api/users/reset-password"
    );

    private final JwtService jwtService;

    private final CustomUserDetailsService
            customUserDetailsService;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            CustomUserDetailsService
                    customUserDetailsService) {

        this.jwtService = jwtService;

        this.customUserDetailsService =
                customUserDetailsService;
    }

    /*
     * Skip JWT authentication completely for:
     * 1. Public authentication endpoints
     * 2. Browser CORS preflight requests
     */
    @Override
    protected boolean shouldNotFilter(
            HttpServletRequest request) {

        String requestPath =
                request.getServletPath();

        boolean isOptionsRequest =
                "OPTIONS".equalsIgnoreCase(
                        request.getMethod()
                );

        boolean isPublicEndpoint =
                PUBLIC_ENDPOINTS.contains(
                        requestPath
                );

        return isOptionsRequest
                || isPublicEndpoint;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException,
            IOException {

        String authorizationHeader =
                request.getHeader(
                        "Authorization"
                );

        /*
         * No JWT token was provided.
         * Continue without authentication.
         */
        if (authorizationHeader == null
                || !authorizationHeader
                        .startsWith("Bearer ")) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        String token =
                authorizationHeader
                        .substring(7)
                        .trim();

        if (token.isEmpty()) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        String email;

        try {

            email = jwtService
                    .extractEmail(token);

        } catch (Exception exception) {

            /*
             * Invalid or expired JWT.
             * Clear any existing authentication and
             * continue the filter chain.
             */
            SecurityContextHolder
                    .clearContext();

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        boolean isNotAuthenticated =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        == null;

        if (email != null
                && isNotAuthenticated) {

            try {

                UserDetails userDetails =
                        customUserDetailsService
                                .loadUserByUsername(
                                        email
                                );

                boolean validToken =
                        jwtService.isTokenValid(
                                token,
                                userDetails
                                        .getUsername()
                        );

                if (validToken) {

                    UsernamePasswordAuthenticationToken
                            authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails
                                            .getAuthorities()
                            );

                    authentication.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(
                                            request
                                    )
                    );

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(
                                    authentication
                            );
                }

            } catch (Exception exception) {

                SecurityContextHolder
                        .clearContext();
            }
        }

        filterChain.doFilter(
                request,
                response
        );
    }
}
package com.pcms.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.pcms.security.CustomUserDetailsService;
import com.pcms.security.jwt.JwtAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter
            jwtAuthenticationFilter;

    private final CustomUserDetailsService
            customUserDetailsService;

    private final PasswordEncoder
            passwordEncoder;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            CustomUserDetailsService customUserDetailsService,
            PasswordEncoder passwordEncoder
    ) {
        this.jwtAuthenticationFilter =
                jwtAuthenticationFilter;

        this.customUserDetailsService =
                customUserDetailsService;

        this.passwordEncoder =
                passwordEncoder;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                /*
                 * JWT authentication is stateless, so CSRF
                 * protection is disabled for this REST API.
                 */
                .csrf(csrf -> csrf.disable())

                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )

                .formLogin(form ->
                        form.disable()
                )

                .httpBasic(basic ->
                        basic.disable()
                )

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authenticationProvider(
                        authenticationProvider()
                )

                .authorizeHttpRequests(auth -> auth

                        /*
                         * Allow browser CORS preflight requests.
                         */
                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()

                        /*
                         * Public authentication endpoints.
                         */
                        .requestMatchers(
                                "/api/users/login",
                                "/api/users/register",

                                "/api/users/forgot-password",
                                "/api/users/forgot-password/**",

                                "/api/users/verify-otp",
                                "/api/users/verify-otp/**",

                                "/api/users/reset-password",
                                "/api/users/reset-password/**"
                        ).permitAll()

                        /*
                         * Keep this in case some existing
                         * authentication controllers use /api/auth.
                         */
                        .requestMatchers(
                                "/api/auth/**"
                        ).permitAll()

                        /*
                         * Admin-only APIs.
                         */
                        .requestMatchers(
                                "/api/admin/**"
                        ).hasAnyAuthority(
                                "ADMIN",
                                "ROLE_ADMIN"
                        )

                        /*
                         * Customer-only APIs.
                         */
                        .requestMatchers(
                                "/api/customer/**"
                        ).hasAnyAuthority(
                                "CUSTOMER",
                                "ROLE_CUSTOMER"
                        )

                        /*
                         * User profile and account APIs require
                         * login but work for both admin and customer.
                         */
                        .requestMatchers(
                                "/api/users/profile",
                                "/api/users/profile/**",

                                "/api/users/change-password",
                                "/api/users/change-password/**"
                        ).authenticated()

                        /*
                         * Every remaining endpoint requires login.
                         */
                        .anyRequest()
                        .authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource
            corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:5173"
                )
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "PATCH",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of(
                        "Authorization",
                        "Content-Type",
                        "Accept"
                )
        );

        configuration.setExposedHeaders(
                List.of(
                        "Authorization"
                )
        );

        configuration.setAllowCredentials(
                true
        );

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }

    @Bean
    public AuthenticationProvider
            authenticationProvider() {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider();

        provider.setUserDetailsService(
                customUserDetailsService
        );

        provider.setPasswordEncoder(
                passwordEncoder
        );

        return provider;
    }
}
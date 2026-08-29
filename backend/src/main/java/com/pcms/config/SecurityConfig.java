//package com.pcms.config;
//
//import java.util.List;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.authentication.AuthenticationProvider;
//import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
//import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.CorsConfigurationSource;
//import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
//
//import com.pcms.security.CustomUserDetailsService;
//import com.pcms.security.jwt.JwtAuthenticationFilter;
//
//@Configuration
//@EnableMethodSecurity
//public class SecurityConfig {
//
//    private final JwtAuthenticationFilter jwtAuthenticationFilter;
//    private final CustomUserDetailsService customUserDetailsService;
//    private final PasswordEncoder passwordEncoder;
//
//    public SecurityConfig(
//            JwtAuthenticationFilter jwtAuthenticationFilter,
//            CustomUserDetailsService customUserDetailsService,
//            PasswordEncoder passwordEncoder) {
//
//        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
//        this.customUserDetailsService = customUserDetailsService;
//        this.passwordEncoder = passwordEncoder;
//    }
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(
//            HttpSecurity http) throws Exception {
//
//        http
//                .csrf(csrf -> csrf.disable())
//
//                .cors(cors -> cors.configurationSource(
//                        corsConfigurationSource()
//                ))
//
//                .formLogin(form -> form.disable())
//
//                .httpBasic(basic -> basic.disable())
//
//                .sessionManagement(session ->
//                        session.sessionCreationPolicy(
//                                SessionCreationPolicy.STATELESS
//                        )
//                )
//
//                .authenticationProvider(authenticationProvider())
//
//                .authorizeHttpRequests(auth -> auth
//                		.requestMatchers(
//                		        "/api/users/register",
//                		        "/api/users/login",
//                		        "/api/users/forgot-password",
//                		        "/api/users/verify-otp",
//                		        "/api/users/reset-password"
//                		).permitAll()
//
//                        .requestMatchers("/api/admin/**")
//                        .hasRole("ADMIN")
//
//                        .requestMatchers("/api/customer/**")
//                        .hasRole("CUSTOMER")
//
//                        .anyRequest()
//                        .authenticated()
//                )
//
//                .addFilterBefore(
//                        jwtAuthenticationFilter,
//                        UsernamePasswordAuthenticationFilter.class
//                );
//
//        return http.build();
//    }
//
//    @Bean
//    public CorsConfigurationSource corsConfigurationSource() {
//
//        CorsConfiguration configuration =
//                new CorsConfiguration();
//
//        configuration.setAllowedOrigins(
//                List.of("http://localhost:5173")
//        );
//
//        configuration.setAllowedMethods(
//                List.of(
//                        "GET",
//                        "POST",
//                        "PUT",
//                        "PATCH",
//                        "DELETE",
//                        "OPTIONS"
//                )
//        );
//
//        configuration.setAllowedHeaders(
//                List.of(
//                        "Authorization",
//                        "Content-Type"
//                )
//        );
//
//        configuration.setExposedHeaders(
//                List.of("Authorization")
//        );
//
//        configuration.setAllowCredentials(true);
//
//        UrlBasedCorsConfigurationSource source =
//                new UrlBasedCorsConfigurationSource();
//
//        source.registerCorsConfiguration(
//                "/**",
//                configuration
//        );
//
//        return source;
//    }
//
//    @Bean
//    public AuthenticationProvider authenticationProvider() {
//
//        DaoAuthenticationProvider provider =
//                new DaoAuthenticationProvider();
//
//        provider.setUserDetailsService(
//                customUserDetailsService
//        );
//
//        provider.setPasswordEncoder(
//                passwordEncoder
//        );
//
//        return provider;
//    }
//}

package com.pcms.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
import com.pcms.security.oauth.GoogleOAuth2SuccessHandler;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    private final CustomUserDetailsService customUserDetailsService;

    private final PasswordEncoder passwordEncoder;

    private final GoogleOAuth2SuccessHandler googleOAuth2SuccessHandler;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            CustomUserDetailsService customUserDetailsService,
            PasswordEncoder passwordEncoder,
            GoogleOAuth2SuccessHandler googleOAuth2SuccessHandler) {

        this.jwtAuthenticationFilter =
                jwtAuthenticationFilter;

        this.customUserDetailsService =
                customUserDetailsService;

        this.passwordEncoder =
                passwordEncoder;

        this.googleOAuth2SuccessHandler =
                googleOAuth2SuccessHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

                .csrf(csrf ->
                        csrf.disable()
                )

                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )

                /*
                 * OAuth2 login needs a temporary session
                 * during Google's authentication process.
                 */
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.IF_REQUIRED
                        )
                )

                .formLogin(form -> form.disable())

                .httpBasic(basic -> basic.disable())

                .oauth2Login(oauth2 -> oauth2
                        .successHandler(
                                googleOAuth2SuccessHandler
                        )
                )

                .authenticationProvider(
                        authenticationProvider()
                )

                .authorizeHttpRequests(auth -> auth

                        /*
                         * Normal authentication APIs
                         */
                        .requestMatchers(
                                "/api/users/register",
                                "/api/users/login",
                                "/api/users/forgot-password",
                                "/api/users/verify-otp",
                                "/api/users/reset-password"
                        )
                        .permitAll()

                        /*
                         * Google OAuth2 URLs
                         */
                        .requestMatchers(
                                "/oauth2/**",
                                "/login/oauth2/**"
                        )
                        .permitAll()

                        /*
                         * Admin APIs
                         */
                        .requestMatchers(
                                "/api/admin/**"
                        )
                        .hasRole("ADMIN")

                        /*
                         * Customer APIs
                         */
                        .requestMatchers(
                                "/api/customer/**"
                        )
                        .hasRole("CUSTOMER")

                        .anyRequest()
                        .authenticated()
                )

                /*
                 * Google Login
                 */
                

                /*
                 * Existing JWT authentication
                 */
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

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
                        "Content-Type"
                )
        );

        configuration.setExposedHeaders(
                List.of(
                        "Authorization"
                )
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {

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
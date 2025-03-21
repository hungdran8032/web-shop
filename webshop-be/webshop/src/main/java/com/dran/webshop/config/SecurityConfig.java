package com.dran.webshop.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Collections;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final String[] WHITE_LIST = {
            "api/v1/auth/**",
            "/api/v1/products",
            "/api/v1/products/**",
            "/api/v1/categories",
            "/api/v1/categories/**",
            "/api/v1/users/**",
            // "/**"
    };

    private final String[] BLACK_LIST = {
            "/api/v1/products/add",
            "/api/v1/products/update",
            "/api/v1/products/delete",
            "/api/v1/categories/add",
            "/api/v1/categories/update",
            "/api/v1/categories/delete"
    };
    private final JwtTokenValidator jwt;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(CsrfConfigurer::disable)
                .authorizeHttpRequests(config -> config
                        .requestMatchers(WHITE_LIST).permitAll()
                        .requestMatchers(BLACK_LIST).hasRole("ADMIN")
                        .anyRequest().authenticated())
                .addFilterBefore(jwt, UsernamePasswordAuthenticationFilter.class)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .exceptionHandling(ex -> ex.authenticationEntryPoint((_, response, authException) -> {
                    response.setContentType("application/json");
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"" +
                            authException.getMessage() + "\", \"status\": 401}");
                }));
        ;
        return http.build();
    }

    @Bean
    // Cấu hình CORS
    public CorsConfigurationSource corsConfigurationSource() {
        return new CorsConfigurationSource() {
            @Override
            // Lấy cấu hình CORS
            public CorsConfiguration getCorsConfiguration(@NonNull HttpServletRequest request) {
                // Cấu hình CORS
                CorsConfiguration cfg = new CorsConfiguration();
                // Cho phép tất cả các nguồn
                cfg.setAllowedOrigins(Collections.singletonList("http://localhost:5173"));
                // Cho phép tất cả các phương thức
                cfg.setAllowedMethods(Collections.singletonList("*"));
                // Cho phép tất cả các header
                cfg.setAllowedHeaders(Collections.singletonList("*"));
                // Cho phép gửi credentials
                cfg.setAllowCredentials(true);
                // Cho phép hiển thị header Authorization
                cfg.setExposedHeaders(Collections.singletonList("Authorization"));
                // Thời gian tồn tại của CORS
                cfg.setMaxAge(3600L);
                return cfg;
            }
        };
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

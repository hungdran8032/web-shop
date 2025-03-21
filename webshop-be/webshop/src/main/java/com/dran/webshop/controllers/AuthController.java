package com.dran.webshop.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dran.webshop.request.AuthRequest;
import com.dran.webshop.request.RefreshTokenRequest;
import com.dran.webshop.request.UserCreateRequest;
import com.dran.webshop.response.AccessTokenResponse;
import com.dran.webshop.response.ApiResponse;
import com.dran.webshop.response.AuthResponse;
import com.dran.webshop.response.UserResponse;
import com.dran.webshop.service.AuthService;
import com.dran.webshop.service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/login")
    public ApiResponse<AuthResponse> auth(@RequestBody AuthRequest req) {
        AuthResponse res = authService.auth(req);

        return ApiResponse.<AuthResponse>builder()
                .status(200)
                .message("Success")
                .data(res)
                .build();
    }

    @PostMapping("/refresh")
    public ApiResponse<AccessTokenResponse> refresh(@RequestBody RefreshTokenRequest req) {
        AccessTokenResponse res = authService.verifyToken(req.getRefreshToken());

        return ApiResponse.<AccessTokenResponse>builder()
                .status(200)
                .message("Success")
                .data(res)
                .build();
    }

    @PostMapping("/register")
    public ApiResponse<UserResponse> createUser(@RequestBody UserCreateRequest req) {
        UserResponse res = userService.createUser(req);

        return ApiResponse.<UserResponse>builder()
                .status(200)
                .message("Success")
                .data(res)
                .build();
    }

}

package com.dran.webshop.service.Impl;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.dran.webshop.config.JwtProvider;
import com.dran.webshop.mapper.UserMapper;
import com.dran.webshop.model.User;
import com.dran.webshop.request.AuthRequest;
import com.dran.webshop.response.AccessTokenResponse;
import com.dran.webshop.response.AuthResponse;
import com.dran.webshop.service.AuthService;
import com.dran.webshop.service.UserService;
import com.dran.webshop.util.TypeToken;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtProvider jwtProvider;
    private final UserMapper userMapper;

    @Override
    public AuthResponse auth(AuthRequest req) {
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword()));
        User user = userService.findByUsername(req.getUsername());
        if (user == null) {
            log.error("User not found for username: {}", req.getUsername());
            throw new UsernameNotFoundException("User not found with username: " + req.getUsername());
        }
        String accessToken = jwtProvider.generateToken(user, TypeToken.ACCESS);
        String refreshToken = jwtProvider.generateToken(user, TypeToken.REFRESH);
        return AuthResponse.builder()
                .userRes(userMapper.toUserResponse(user))
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Override
    public AccessTokenResponse verifyToken(String req) {
        String username = jwtProvider.verifyTokenAndUsername(req, TypeToken.REFRESH);

        User user = userService.findByUsername(username);

        String accessToken = jwtProvider.generateToken(user, TypeToken.ACCESS);

        return AccessTokenResponse.builder()
                .accessToken(accessToken)
                .build();
    }
}

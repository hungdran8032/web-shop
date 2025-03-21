package com.dran.webshop.service;

import com.dran.webshop.request.AuthRequest;
import com.dran.webshop.response.AccessTokenResponse;
import com.dran.webshop.response.AuthResponse;

public interface AuthService {
    // Login
    AuthResponse auth(AuthRequest req);

    // Access Token
    AccessTokenResponse verifyToken(String req);
}

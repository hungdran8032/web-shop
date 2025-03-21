package com.dran.webshop.config;

import io.jsonwebtoken.security.Keys;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.dran.webshop.custom.CustomUserDetail;
import com.dran.webshop.model.User;
import com.dran.webshop.util.TypeToken;

import io.jsonwebtoken.Jwts;

@Service
public class JwtProvider {

    @Value("${jwt.expire.accessToken}")
    private Long ACCESS_EXPIRATION;

    @Value("${jwt.expire.refreshToken}")
    private Long REFRESH_EXPIRATION;

    @Value("${jwt.secretKey.accessToken}")
    private String ACCESS_KEY;

    @Value("${jwt.secretKey.refreshToken}")
    private String REFRESH_KEY;

    @Value("${jwt.issuer}")
    private String ISSUER;

    public String generateToken(User user, TypeToken typeToken) {
        return Jwts.builder()
                .claim("userId", user.getId())
                .subject(user.getUsername())
                .claim("roles", getRoles(user))
                .issuer(ISSUER)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + getExpirationTime(typeToken)))
                .signWith(getSecretKey(typeToken))
                .compact();
    }

    public String verifyTokenAndUsername(String token, TypeToken typeToken) {
        return Jwts.parser()
                .verifyWith(getSecretKey(typeToken))
                .requireIssuer(ISSUER)
                .build()
                .parseClaimsJws(token)
                .getPayload().getSubject();
    }

    private String getRoles(CustomUserDetail user) {
        String role = user.getAuthorities().toString();
        return role.substring(1, role.length() - 1);
    }

    private Long getExpirationTime(TypeToken typeToken) {
        return typeToken == TypeToken.ACCESS ? ACCESS_EXPIRATION : REFRESH_EXPIRATION;
    }

    private SecretKey getSecretKey(TypeToken typeToken) {
        return Keys.hmacShaKeyFor(typeToken == TypeToken.ACCESS ? ACCESS_KEY.getBytes() : REFRESH_KEY.getBytes());
    }

}

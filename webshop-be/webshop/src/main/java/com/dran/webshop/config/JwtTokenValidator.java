package com.dran.webshop.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.filter.OncePerRequestFilter;

import com.dran.webshop.util.TypeToken;

import java.io.IOException;

@RequiredArgsConstructor
@Service
@Slf4j
public class JwtTokenValidator extends OncePerRequestFilter {
    private final JwtProvider jwtProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authorization = request.getHeader(JWT_CONSTANT.JWT_HEADER);

        if (authorization != null && authorization.startsWith("Bearer ")) {
            String token = authorization.substring(7);
            try {
                if (SecurityContextHolder.getContext().getAuthentication() == null) {
                    String username = jwtProvider.verifyTokenAndUsername(token, TypeToken.ACCESS);

                    SecurityContext context = SecurityContextHolder.createEmptyContext();
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(username, null,
                            null);
                    context.setAuthentication(auth);
                    SecurityContextHolder.setContext(context);
                }
            } catch (Exception e) {
                log.error("Error validating token: {}", e.getMessage());
            }
        }
        filterChain.doFilter(request, response);
    }

}

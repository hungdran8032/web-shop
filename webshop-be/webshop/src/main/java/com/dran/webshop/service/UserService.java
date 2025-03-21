package com.dran.webshop.service;

import com.dran.webshop.model.User;
import com.dran.webshop.request.UserCreateRequest;
import com.dran.webshop.response.UserResponse;
import com.dran.webshop.util.TypeToken;

import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UserService extends UserDetailsService {
    User findByUsername(String username);

    User findByEmail(String email);

    List<UserResponse> findAll(Integer page, Integer size);

    UserResponse createUser(UserCreateRequest req);

    UserResponse updateUser(Long id, UserCreateRequest req);

}

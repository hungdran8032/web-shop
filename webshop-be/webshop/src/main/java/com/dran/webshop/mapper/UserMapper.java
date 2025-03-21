package com.dran.webshop.mapper;

import org.springframework.stereotype.Service;

import com.dran.webshop.model.User;
import com.dran.webshop.response.UserResponse;

@Service
public class UserMapper {
    public UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .roleNames(user.getUserRoles().stream()
                        .map(userRole -> userRole.getRole().getName())
                        .toList())
                .build();
    }
}

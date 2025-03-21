package com.dran.webshop.controllers;

import com.dran.webshop.model.Role;
import com.dran.webshop.model.User;
import com.dran.webshop.model.UserRole;
import com.dran.webshop.repository.UserRepository;
import com.dran.webshop.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserRepository userRepository;
    private final RoleService roleService;

    @PostMapping("/{userId}/roles/{roleName}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> assignRoleToUser(@PathVariable Long userId, @PathVariable String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Role role = roleService.findByName(roleName);
        if (role == null) {
            throw new RuntimeException("Role not found");
        }

        UserRole userRole = UserRole.builder()
                .user(user)
                .role(role)
                .build();
        user.getUserRoles().add(userRole);
        userRepository.save(user);

        return ResponseEntity.ok("Role assigned successfully");
    }
}
package com.dran.webshop.controllers;

import com.dran.webshop.model.Role;
import com.dran.webshop.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
public class RoleController {
    private final RoleService roleService;

    @PostMapping("/{name}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Role> createRole(@PathVariable String name) {
        Role role = roleService.findByName(name);
        if (role != null) {
            return ResponseEntity.badRequest().body(role);
        }
        role = Role.builder().name(name).build();
        // Lưu role vào database (cần thêm phương thức save vào RoleService)
        return ResponseEntity.ok(role);
    }
}
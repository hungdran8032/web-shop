package com.dran.webshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dran.webshop.model.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByName(String name);

}

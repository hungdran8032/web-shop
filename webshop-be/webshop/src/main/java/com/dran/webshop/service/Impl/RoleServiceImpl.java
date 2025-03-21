package com.dran.webshop.service.Impl;

import org.springframework.stereotype.Service;

import com.dran.webshop.model.Role;
import com.dran.webshop.repository.RoleRepository;
import com.dran.webshop.service.RoleService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {
    private final RoleRepository roleRepository;

    @Override
    public Role findByName(String name) {
        return roleRepository.findByName(name);

    }

}

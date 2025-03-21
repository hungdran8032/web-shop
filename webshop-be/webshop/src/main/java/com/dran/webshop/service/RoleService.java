package com.dran.webshop.service;

import com.dran.webshop.model.Role;

public interface RoleService {
    Role findByName(String name);
}

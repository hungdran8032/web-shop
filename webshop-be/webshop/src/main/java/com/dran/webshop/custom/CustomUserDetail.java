package com.dran.webshop.custom;

import org.springframework.security.core.userdetails.UserDetails;

public interface CustomUserDetail extends UserDetails {
    Long getId();

}

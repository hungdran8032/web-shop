package com.dran.webshop.request;

import lombok.Data;

@Data
public class UserCreateRequest {
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String password;
}

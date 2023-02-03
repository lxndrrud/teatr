package com.laymdt.reservation_backend.dto;

import lombok.Data;

@Data
public class User {
    private long id;
    private String email;
    private String password;
    private String firstname;
    private String middlename;
    private String lastname;
    private Role role;
}

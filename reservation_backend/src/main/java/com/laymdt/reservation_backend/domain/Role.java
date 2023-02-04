package com.laymdt.reservation_backend.domain;

import lombok.Data;

import java.util.List;

@Data
public class Role {
    private long id;
    private String title;
    private List<Permission> permissionList;
}

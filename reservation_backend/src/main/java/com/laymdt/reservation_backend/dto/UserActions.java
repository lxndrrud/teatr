package com.laymdt.reservation_backend.dto;

import lombok.Data;

@Data
public class UserActions {
    private long id;
    private String description;
    private User user;
}

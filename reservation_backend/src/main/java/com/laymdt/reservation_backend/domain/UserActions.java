package com.laymdt.reservation_backend.domain;

import lombok.Data;

@Data
public class UserActions {
    private long id;
    private String description;
    private User user;
}

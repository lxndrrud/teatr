package com.laymdt.reservation_backend.dto;

import lombok.Data;

import java.util.Date;

@Data
public class UserSession {
    private long id;
    private User user;
    private String token;
    private String deviceInfo;
    private Date createdAt;
}

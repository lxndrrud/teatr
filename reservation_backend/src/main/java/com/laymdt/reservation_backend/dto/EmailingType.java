package com.laymdt.reservation_backend.dto;

import lombok.Data;

@Data
public class EmailingType {
    private long id;
    private String title;
    private int resendInterval;
    private int repeatInterval;
    private boolean repeatable;
}

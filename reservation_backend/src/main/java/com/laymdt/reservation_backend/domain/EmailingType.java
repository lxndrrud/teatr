package com.laymdt.reservation_backend.domain;

import lombok.Data;

@Data
public class EmailingType {
    private long id;
    private String title;
    private int resendInterval;
    private int repeatInterval;
    private boolean repeatable;
}

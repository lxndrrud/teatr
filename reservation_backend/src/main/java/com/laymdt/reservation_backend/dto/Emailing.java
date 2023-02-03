package com.laymdt.reservation_backend.dto;

import lombok.Data;

@Data
public class Emailing {
    private long id;
    private String receiverEmail;
    private String topic;
    private String text;
    private EmailingType emailingType;
}

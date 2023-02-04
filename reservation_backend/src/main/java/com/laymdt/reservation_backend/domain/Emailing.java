package com.laymdt.reservation_backend.domain;

import lombok.Data;

@Data
public class Emailing {
    private long id;
    private String receiverEmail;
    private String topic;
    private String text;
    private EmailingType emailingType;
}

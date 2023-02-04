package com.laymdt.reservation_backend.domain;

import lombok.Data;

import java.util.Date;

@Data
public class Payment {
    private long id;
    private User user;
    private double sum;
    private PaymentType paymentType;
    private Date createdAt;
}

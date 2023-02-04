package com.laymdt.reservation_backend.domain;

import lombok.Data;


@Data
public class SeatPrice {
    private long id;
    private double price;
    private AuditoriumSeat auditoriumSeat;
    private PricePolicy pricePolicy;
}

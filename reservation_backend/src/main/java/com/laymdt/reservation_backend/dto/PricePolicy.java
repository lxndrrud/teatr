package com.laymdt.reservation_backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class PricePolicy {
    private long id;
    private String title;
    private Auditorium auditorium;
    private List<SeatPrice> seatPrices;
}

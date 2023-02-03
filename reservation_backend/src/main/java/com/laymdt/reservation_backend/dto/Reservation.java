package com.laymdt.reservation_backend.dto;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class Reservation {
    private long id;
    private User user;
    private List<SeatPrice> seatPriceList;
    private Session session;
    private Date createdAt;
}

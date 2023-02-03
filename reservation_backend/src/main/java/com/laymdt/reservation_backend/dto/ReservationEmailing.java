package com.laymdt.reservation_backend.dto;

import lombok.Data;

@Data
public class ReservationEmailing {
    private long id;
    private EmailingType emailingType;
    private Reservation reservation;
}

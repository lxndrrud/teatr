package com.laymdt.reservation_backend.domain;

import lombok.Data;

@Data
public class ReservationEmailing {
    private long id;
    private EmailingType emailingType;
    private Reservation reservation;
}

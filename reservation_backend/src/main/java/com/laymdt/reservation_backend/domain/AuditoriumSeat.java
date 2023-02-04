package com.laymdt.reservation_backend.domain;

import lombok.Data;

@Data
public class AuditoriumSeat {
    private long id;
    private int number;
    private AuditoriumRow auditoriumRow;
}

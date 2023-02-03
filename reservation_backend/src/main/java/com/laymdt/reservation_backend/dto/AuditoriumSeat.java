package com.laymdt.reservation_backend.dto;

import lombok.Data;

@Data
public class AuditoriumSeat {
    private long id;
    private int number;
    private AuditoriumRow auditoriumRow;
}

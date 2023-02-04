package com.laymdt.reservation_backend.domain;

import lombok.Data;

import java.util.List;

@Data
public class AuditoriumRow {
    private long id;
    private int number;
    private List<AuditoriumSeat> auditoriumSeats;
    private Auditorium auditorium;
}

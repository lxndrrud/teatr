package com.laymdt.reservation_backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class Auditorium {
    private long id;
    private String title;
    private List<AuditoriumRow> auditoriumRows;
}

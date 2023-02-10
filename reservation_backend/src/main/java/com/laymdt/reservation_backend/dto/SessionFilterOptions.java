package com.laymdt.reservation_backend.dto;

import lombok.Data;

import java.util.Date;

@Data
public class SessionFilterOptions {
    String auditoriumTitle;
    String playTitle;
    Date dateFrom;
    Date dateTo;
}

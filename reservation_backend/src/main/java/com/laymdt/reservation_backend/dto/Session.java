package com.laymdt.reservation_backend.dto;

import lombok.Data;

import java.util.Date;

@Data
public class Session {
    private long id;
    private Date timestamp;
    private Play play;
    private PricePolicy pricePolicy;
    private boolean isAvailable;
    private boolean hasPast;

    public boolean isReservationAvailable() {
        return isAvailable && !hasPast;
    }
}

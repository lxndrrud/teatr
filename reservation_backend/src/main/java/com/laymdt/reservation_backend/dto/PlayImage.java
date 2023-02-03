package com.laymdt.reservation_backend.dto;

import lombok.Data;

@Data
public class PlayImage {
    private long id;
    private Image image;
    private Play play;
    private boolean isPoster;
}

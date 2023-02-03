package com.laymdt.reservation_backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class Play {
    private long id;
    private String title;
    private String description;
    private String crew;
    private List<PlayImage> images;
}

package com.laymdt.reservation_backend.domain;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity(name = "images")
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column
    private String filepath;
}

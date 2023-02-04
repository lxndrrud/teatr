package com.laymdt.reservation_backend.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity(name = "plays_images")
public class PlayImage {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @OneToOne
    @JoinColumn(name = "id_image")
    private Image image;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "id_play", nullable = false)
    private Play play;
    @Column
    private boolean isPoster;
}

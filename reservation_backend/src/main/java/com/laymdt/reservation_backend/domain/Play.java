package com.laymdt.reservation_backend.domain;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Data
@Entity(name = "plays")
public class Play {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column
    private String title;
    @Column
    private String description;
    @Column
    private String crew;
    @OneToMany(mappedBy = "play")
    @JsonManagedReference
    private List<PlayImage> playImages;
}

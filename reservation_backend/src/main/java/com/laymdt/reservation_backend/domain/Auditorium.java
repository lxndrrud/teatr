package com.laymdt.reservation_backend.domain;

import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Data
@Entity(name = "auditoriums")
public class Auditorium {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column
    private String title;

    // private List<AuditoriumRow> auditoriumRows = null;

    /*
    @OneToMany(mappedBy = "auditorium")
    private List<PricePolicy> pricePolicies;
     */
}

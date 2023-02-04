package com.laymdt.reservation_backend.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Data
@Entity(name = "price_policies")
public class PricePolicy {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column
    private String title;
    /*
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "id_auditorium", nullable = false)
    private Auditorium auditorium;
     */

    // private List<SeatPrice> seatPrices;
}

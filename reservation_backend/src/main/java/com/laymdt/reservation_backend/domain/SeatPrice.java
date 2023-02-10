package com.laymdt.reservation_backend.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;


@Data
@Entity(name = "slots")
public class SeatPrice {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column
    private Double price;
    @ManyToOne
    @JoinColumn(name = "id_seat", nullable = false)
    private AuditoriumSeat auditoriumSeat;
    @ManyToOne
    @JoinColumn(name = "id_price_policy", nullable = false)
    @JsonBackReference
    private PricePolicy pricePolicy;
}

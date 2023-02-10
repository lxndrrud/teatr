package com.laymdt.reservation_backend.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
    @OneToMany(mappedBy = "pricePolicy")
    @JsonManagedReference
    private List<SeatPrice> seatPrices;
}

package com.laymdt.reservation_backend.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity(name = "seats")
public class AuditoriumSeat {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column
    private Integer number;

    @ManyToOne
    @JoinColumn(name = "id_row", nullable = false)
    @JsonManagedReference
    private AuditoriumRow auditoriumRow;
}

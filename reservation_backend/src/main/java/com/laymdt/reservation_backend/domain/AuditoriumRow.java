package com.laymdt.reservation_backend.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Data
@Entity(name = "rows")
public class AuditoriumRow {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column
    private Integer number;
    @OneToMany(mappedBy = "auditoriumRow")
    @JsonBackReference
    private List<AuditoriumSeat> auditoriumSeats;

    @ManyToOne
    @JoinColumn(name = "id_auditorium", nullable = false)
    @JsonManagedReference
    private Auditorium auditorium;
}

package com.laymdt.reservation_backend.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity(name = "sessions")
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column
    private Date timestamp;
    @ManyToOne
    @JoinColumn(name = "id_play", nullable = false)
    private Play play;
    @ManyToOne
    @JoinColumn(name = "id_price_policy", nullable = false)
    private PricePolicy pricePolicy;
    @Column(name = "is_locked")
    private Boolean isLocked;

    @JsonIgnore
    public Boolean isReservationAvailable() {
        return !isLocked && timestamp.after(new Date());
    }
}

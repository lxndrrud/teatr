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
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "id_play", nullable = false)
    private Play play;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "id_price_policy", nullable = false)
    private PricePolicy pricePolicy;
    @Column(name = "is_locked")
    private boolean isLocked;

    public boolean isReservationAvailable() {
        return isLocked && timestamp.before(new Date());
    }
}

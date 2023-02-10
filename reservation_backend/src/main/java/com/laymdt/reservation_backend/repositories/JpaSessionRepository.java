package com.laymdt.reservation_backend.repositories;

import com.laymdt.reservation_backend.domain.Session;
import com.laymdt.reservation_backend.dto.SessionFilterOptions;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManagerFactory;
import javax.persistence.TypedQuery;
import java.util.HashMap;
import java.util.List;

@Repository
public class JpaSessionRepository implements ISessionRepository {

    private final EntityManagerFactory entityManagerFactory;

    public JpaSessionRepository (
            EntityManagerFactory entityManagerFactory
    ) {
        this.entityManagerFactory = entityManagerFactory;
    }
    @Override
    public List<Session> getAll() {
        TypedQuery<Session> query = this.entityManagerFactory.createEntityManager().createQuery(
            "SELECT s FROM sessions s " +
                    "INNER JOIN s.play AS p " +
                    "INNER JOIN s.pricePolicy AS pp " +
                    "ORDER BY s.timestamp ASC ",
            Session.class
        );
        return query.getResultList();
    }

    @Override
    public List<Session> getUnlocked() {
        TypedQuery<Session> query = this.entityManagerFactory.createEntityManager().createQuery(
                "SELECT s FROM sessions s " +
                        "INNER JOIN s.play AS p " +
                        "INNER JOIN s.pricePolicy AS pp " +
                        "WHERE s.isLocked = FALSE " +
                        "ORDER BY s.timestamp ASC ",
                Session.class
        );
        return query.getResultList();
    }

    @Override
    public List<Session> getUnlockedByPlay(Long idPlay) {
        TypedQuery<Session> query = this.entityManagerFactory.createEntityManager().createQuery(
                "SELECT s FROM sessions s " +
                        "INNER JOIN s.play AS p " +
                        "INNER JOIN s.pricePolicy AS pp " +
                        "WHERE s.isLocked = FALSE AND p.id = :idPlay ",
                Session.class
        );
        query.setParameter("idPlay", idPlay);
        return query.getResultList();
    }

    @Override
    public List<Session> getFilteredUnlockedSessions(SessionFilterOptions filterOptions) {
        String statement = "SELECT DISTINCT s FROM sessions s " +
                "INNER JOIN s.play AS p " +
                "INNER JOIN s.pricePolicy AS pp " +
                "INNER JOIN pp.seatPrices AS sp " +
                "INNER JOIN sp.auditoriumSeat AS seats " +
                "INNER JOIN seats.auditoriumRow AS r " +
                "INNER JOIN r.auditorium AS a " +
                "WHERE s.isLocked = FALSE ";
        HashMap<String, Object> map = new HashMap<>();
        if (filterOptions.getPlayTitle() != null ) {
            statement +=  "AND p.title = :playTitle ";
            map.put("playTitle", filterOptions.getPlayTitle());
        }
        if (filterOptions.getAuditoriumTitle() != null) {
            statement += "AND a.title = :auditoriumTitle ";
            map.put("auditoriumTitle", filterOptions.getAuditoriumTitle());
        }
        if (filterOptions.getDateFrom() != null ) {
            statement +=  "AND s.timestamp > :dateFrom ";
            map.put("dateFrom", filterOptions.getDateFrom());
        }
        if (filterOptions.getDateTo() != null ) {
            statement +=  "AND s.timestamp < :dateTo ";
            map.put("dateTo", filterOptions.getDateTo());
        }
        TypedQuery<Session> query = this.entityManagerFactory.createEntityManager().createQuery(
                statement,
                Session.class
        );
        for (String key : map.keySet()) {
            query.setParameter(key, map.get(key));
        }
        return query.getResultList();
    }
}

package com.laymdt.reservation_backend.repositories;

import com.laymdt.reservation_backend.domain.Session;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManagerFactory;
import javax.persistence.TypedQuery;
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
                    "INNER JOIN s.pricePolicy AS pp ",
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
                        "WHERE s.isLocked = FALSE ",
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
}

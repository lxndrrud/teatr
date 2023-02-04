package com.laymdt.reservation_backend.repositories;

import com.laymdt.reservation_backend.domain.Play;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManagerFactory;
import javax.persistence.TypedQuery;
import java.util.List;
import java.util.Optional;

@Repository
public class JpaPlayRepository implements IPlayRepository {
    private final EntityManagerFactory entityManagerFactory;

    public JpaPlayRepository (
        EntityManagerFactory entityManagerFactory
    ) {
        this.entityManagerFactory = entityManagerFactory;
    }

    @Override
    public List<Play> getAll() {
        TypedQuery<Play> query = this.entityManagerFactory.createEntityManager().createQuery(
            "SELECT p FROM plays p " +
                    "INNER JOIN p.playImages pi " +
                    "INNER JOIN pi.image i ",
                Play.class
        );
        return query.getResultList();
    }

    @Override
    public Optional<Play> getById(Long id) {
        TypedQuery<Play> query = this.entityManagerFactory.createEntityManager().createQuery(
                "SELECT p FROM plays p " +
                        "INNER JOIN p.playImages AS pi " +
                        "INNER JOIN pi.image AS i " +
                        "WHERE p.id = :id ",
                Play.class
        );
        query.setParameter("id", id);
        List<Play> result = query.getResultList();
        return result.size() == 0 ? Optional.empty() : Optional.of(result.get(0));
    }
}

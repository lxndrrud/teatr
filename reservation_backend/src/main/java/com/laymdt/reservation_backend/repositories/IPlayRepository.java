package com.laymdt.reservation_backend.repositories;

import com.laymdt.reservation_backend.domain.Play;

import java.util.List;
import java.util.Optional;

public interface IPlayRepository {
    List<Play> getAll();

    Optional<Play> getById(Long id);
}

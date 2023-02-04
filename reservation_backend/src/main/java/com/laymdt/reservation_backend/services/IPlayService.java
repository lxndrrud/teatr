package com.laymdt.reservation_backend.services;

import com.laymdt.reservation_backend.domain.Play;

import java.util.List;
import java.util.Optional;

public interface IPlayService {
    List<Play> getAll();
    Optional<Play> getById(Long id);
}

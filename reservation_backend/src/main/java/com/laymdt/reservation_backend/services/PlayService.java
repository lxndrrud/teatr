package com.laymdt.reservation_backend.services;

import com.laymdt.reservation_backend.domain.Play;
import com.laymdt.reservation_backend.repositories.IPlayRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlayService implements IPlayService {
    private IPlayRepository playRepository;
    public PlayService(
            IPlayRepository playRepository
    ) {
        this.playRepository = playRepository;
    }

    @Override
    public List<Play> getAll() {
        return this.playRepository.getAll();
    }

    @Override
    public Optional<Play> getById(Long id) {
        return this.playRepository.getById(id);
    }
}

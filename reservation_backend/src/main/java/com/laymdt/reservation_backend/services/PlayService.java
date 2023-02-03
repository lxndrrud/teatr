package com.laymdt.reservation_backend.services;

import com.laymdt.reservation_backend.dto.Play;
import com.laymdt.reservation_backend.repositories.FakePlayRepository;
import com.laymdt.reservation_backend.repositories.IPlayRepository;
import org.springframework.stereotype.Service;

import java.util.List;

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


}

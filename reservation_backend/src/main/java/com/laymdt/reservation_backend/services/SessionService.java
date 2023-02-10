package com.laymdt.reservation_backend.services;

import com.laymdt.reservation_backend.domain.Session;
import com.laymdt.reservation_backend.dto.SessionFilterOptions;
import com.laymdt.reservation_backend.repositories.ISessionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SessionService implements ISessionService {
    private final ISessionRepository sessionRepository;

    public SessionService(
        ISessionRepository sessionRepository
    ) {
        this.sessionRepository = sessionRepository;
    }

    @Override
    public List<Session> getAll() {
        return this.sessionRepository.getAll();
    }

    @Override
    public List<Session> getUnlocked() {
        return this.sessionRepository.getUnlocked()
            .stream()
            .filter(Session::isReservationAvailable)
            .collect(Collectors.toList());
    }

    @Override
    public List<Session> getUnlockedByPlay(Long idPlay) {
        return this.sessionRepository.getUnlockedByPlay(idPlay)
                .stream()
                .filter(Session::isReservationAvailable)
                .collect(Collectors.toList());
    }

    @Override
    public List<Session> getFilteredUnlockedSessions(SessionFilterOptions filterOptions) {
        return this.sessionRepository.getFilteredUnlockedSessions(filterOptions)
            .stream()
            .filter(Session::isReservationAvailable)
            .collect(Collectors.toList());
    }
}

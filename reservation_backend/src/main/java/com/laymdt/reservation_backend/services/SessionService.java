package com.laymdt.reservation_backend.services;

import com.laymdt.reservation_backend.domain.Session;
import com.laymdt.reservation_backend.repositories.ISessionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SessionService implements ISessionService {
    private ISessionRepository sessionRepository;

    public SessionService(
        ISessionRepository sessionRepository
    ) {
        this.sessionRepository = sessionRepository;
    }

    @Override
    public List<Session> getAll() {
        return this.sessionRepository.getAll();
    }
}

package com.laymdt.reservation_backend.services;

import com.laymdt.reservation_backend.domain.Session;
import com.laymdt.reservation_backend.dto.SessionFilterOptions;

import java.util.List;

public interface ISessionService {
    List<Session> getAll();
    List<Session> getUnlocked();
    List<Session> getUnlockedByPlay(Long idPlay);
    List<Session> getFilteredUnlockedSessions(SessionFilterOptions filterOptions);
}

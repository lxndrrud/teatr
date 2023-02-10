package com.laymdt.reservation_backend.controllers;

import com.laymdt.reservation_backend.domain.Session;
import com.laymdt.reservation_backend.dto.SessionFilterOptions;
import com.laymdt.reservation_backend.services.ISessionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/sessions")
public class SessionController {
    private final ISessionService sessionService;

    public SessionController (
        ISessionService sessionService
    ) {
        this.sessionService = sessionService;
    }

    @GetMapping("/")
    public List<Session> getAll() {
        return this.sessionService.getAll();
    }

    @GetMapping("/unlocked")
    public List<Session> getUnlocked() {
        return this.sessionService.getUnlocked()
                .stream()
                .filter(Session::isReservationAvailable)
                .collect(Collectors.toList());
    }

    @GetMapping("/unlocked/play/{playId}")
    public List<Session> getUnlockedByPlay(@PathVariable(name = "playId") long id) {
        return this.sessionService.getUnlockedByPlay(id);
    }

    @GetMapping("/unlocked/filter/")
    public List<Session> getFilteredUnlockedSessions(
        @RequestBody() SessionFilterOptions filterOptions
    ) {
        return this.sessionService.getFilteredUnlockedSessions(filterOptions);
    }
}

package com.laymdt.reservation_backend.controllers;

import com.laymdt.reservation_backend.domain.Session;
import com.laymdt.reservation_backend.services.ISessionService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
}

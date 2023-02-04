package com.laymdt.reservation_backend.services;

import com.laymdt.reservation_backend.domain.Session;

import java.util.List;

public interface ISessionService {
    List<Session> getAll();
}

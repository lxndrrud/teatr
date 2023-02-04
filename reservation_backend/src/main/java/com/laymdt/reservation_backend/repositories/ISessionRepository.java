package com.laymdt.reservation_backend.repositories;

import com.laymdt.reservation_backend.domain.Session;

import java.util.List;

public interface ISessionRepository {
    List<Session> getAll();
}

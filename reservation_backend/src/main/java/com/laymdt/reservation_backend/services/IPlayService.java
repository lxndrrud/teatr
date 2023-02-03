package com.laymdt.reservation_backend.services;

import com.laymdt.reservation_backend.dto.Play;

import java.util.List;

public interface IPlayService {
    List<Play> getAll();
}

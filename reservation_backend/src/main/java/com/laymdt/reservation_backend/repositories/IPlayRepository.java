package com.laymdt.reservation_backend.repositories;

import com.laymdt.reservation_backend.dto.Play;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface IPlayRepository {
    List<Play> getAll();
}

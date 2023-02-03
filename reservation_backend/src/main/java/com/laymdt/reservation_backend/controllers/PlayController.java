package com.laymdt.reservation_backend.controllers;

import com.laymdt.reservation_backend.dto.Play;
import com.laymdt.reservation_backend.services.IPlayService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/plays")
public class PlayController {
    private IPlayService playService;

    public PlayController(
            IPlayService playService
    ) {
        this.playService = playService;
    }

    @GetMapping("/")
    public List<Play> getAll() {
        return this.playService.getAll();
    }
}

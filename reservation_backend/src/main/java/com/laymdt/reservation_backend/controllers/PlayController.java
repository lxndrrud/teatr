package com.laymdt.reservation_backend.controllers;

import com.laymdt.reservation_backend.domain.Play;
import com.laymdt.reservation_backend.services.IPlayService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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

    @GetMapping("/{playId}")
    public Object getById(@PathVariable(name = "playId") long id) {
        Optional<Play> result = this.playService.getById(id);
        if (!result.isPresent()) {
            return new ResponseEntity<Void>(HttpStatus.NOT_FOUND);
        }
        return result;
    }
}

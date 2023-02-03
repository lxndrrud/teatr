package com.laymdt.reservation_backend.services;


import com.laymdt.reservation_backend.dto.Play;
import com.laymdt.reservation_backend.repositories.FakePlayRepository;
import com.laymdt.reservation_backend.repositories.IPlayRepository;
import org.junit.Test;
import org.mockito.Mockito;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class PlayServiceTests {
    @Test
    public void testGetAllPlays() {
        IPlayRepository playRepo = Mockito.mock(FakePlayRepository.class);
        ArrayList<Play> list = new ArrayList<>();
        list.add(new Play());
        Mockito.when(playRepo.getAll()).thenReturn(list);

        PlayService playService = new PlayService(playRepo);

        List<Play> result = playService.getAll();

        assertEquals(result.get(0), new Play());
        assertEquals(result, list);
    }
}

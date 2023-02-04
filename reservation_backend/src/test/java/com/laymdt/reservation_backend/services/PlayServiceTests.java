package com.laymdt.reservation_backend.services;


import com.laymdt.reservation_backend.domain.Image;
import com.laymdt.reservation_backend.domain.Play;
import com.laymdt.reservation_backend.domain.PlayImage;
import com.laymdt.reservation_backend.repositories.IPlayRepository;
import com.laymdt.reservation_backend.repositories.JpaPlayRepository;
import org.junit.Test;
import org.mockito.Mockito;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

public class PlayServiceTests {
    @Test
    public void testGetAllPlays() {
        IPlayRepository playRepo = Mockito.mock(JpaPlayRepository.class);
        ArrayList<Play> list = new ArrayList<>();
        list.add(new Play());
        Mockito.when(playRepo.getAll()).thenReturn(list);

        PlayService playService = new PlayService(playRepo);

        List<Play> result = playService.getAll();

        assertEquals(result.get(0), new Play());
        assertEquals(result, list);
    }

    @Test
    public void testGetByIdOK() {
        IPlayRepository playRepo = Mockito.mock(JpaPlayRepository.class);
        Play testPlay = new Play();
        testPlay.setId((long) 1);
        PlayImage playImage = new PlayImage();
        playImage.setImage(new Image());

        Mockito.when(playRepo.getById((long) 1)).thenReturn(Optional.of(testPlay));

        PlayService playService = new PlayService(playRepo);

        Optional<Play> result = playService.getById((long) 1);

        assertTrue(result.isPresent());
        assertEquals(result.get(), testPlay);
    }

    @Test
    public void testGetByIdFail() {
        IPlayRepository playRepo = Mockito.mock(JpaPlayRepository.class);
        Mockito.when(playRepo.getById((long) 1)).thenReturn(Optional.empty());

        PlayService playService = new PlayService(playRepo);

        Optional<Play> result = playService.getById((long) 1);

        assertFalse(result.isPresent());
    }
 }

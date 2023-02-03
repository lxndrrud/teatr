package com.laymdt.reservation_backend.repositories;

import com.laymdt.reservation_backend.dto.Play;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class FakePlayRepository implements  IPlayRepository {
    @Override
    public List<Play> getAll() {
        ArrayList<Play> list = new ArrayList<>();
        for (int i = 1; i < 6; i++) {
            Play play = new Play();
            play.setId(i);
            play.setTitle("Test title " + i);
            play.setDescription("Test description " + i);
            play.setCrew("Test crew " + i);
            list.add(play);
        }
        return list;
    }
}

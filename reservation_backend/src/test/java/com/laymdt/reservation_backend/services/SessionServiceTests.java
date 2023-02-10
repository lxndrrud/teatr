package com.laymdt.reservation_backend.services;

import com.laymdt.reservation_backend.domain.Session;
import com.laymdt.reservation_backend.repositories.ISessionRepository;
import com.laymdt.reservation_backend.repositories.JpaSessionRepository;
import org.junit.Test;
import org.mockito.Mockito;
import static org.junit.jupiter.api.Assertions.*;


import java.util.ArrayList;
import java.util.List;

public class SessionServiceTests {
    @Test
    public void testGetAllSessions() {
        ISessionRepository mockSessionRepo = Mockito.mock(JpaSessionRepository.class);
        ArrayList<Session> list = new ArrayList<>();
        list.add(new Session());
        Mockito.when(mockSessionRepo.getAll()).thenReturn(list);

        SessionService sessionService = new SessionService(mockSessionRepo);

        List<Session> result = sessionService.getAll();

        assertEquals(result, list);
    }
}

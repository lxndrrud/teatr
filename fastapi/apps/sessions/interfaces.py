from typing import Optional, List
from pydantic import BaseModel
from datetime import date, time
from ..plays.interfaces import PlayModel


class SessionBaseModel(BaseModel):
    id_play: int
    id_price_policy: int
    date: date
    time: time
    is_locked: bool

class SessionModel(SessionBaseModel):
    id: int
    play_title: str
    auditorium_title: str
    class Config:
        orm_mode = True


class SessionFilterQuery(BaseModel):
    date: Optional[date]
    auditorium_title: Optional[str]
    play_title: Optional[str]




from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
from ..plays.interfaces import PlayModel


class SessionBaseModel(BaseModel):
    id_play: int
    id_price_policy: int
    datetime: datetime
    is_locked: bool

class SessionModel(SessionBaseModel):
    id: int
    play_title: str
    auditorium_title: str
    class Config:
        orm_mode = True






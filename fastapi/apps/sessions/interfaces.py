from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
from ..plays.interfaces import PlayModel


class SessionDatabaseModel(BaseModel):
    id_play: int
    price: float
    datetime: datetime

class SessionCreateModel(SessionDatabaseModel):
    pass

class SessionUpdateModel(SessionCreateModel):
    id_play: Optional[int]
    price: Optional[float]
    datetime: Optional[datetime]

class SessionModel(BaseModel):
    play: PlayModel
    datetime: datetime
    price: float




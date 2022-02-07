from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
from ..plays.interfaces import PlayModel


class SessionBaseModel(BaseModel):
    id_play: int
    datetime: datetime

class SessionModel(SessionBaseModel):
    id: int
    class Config:
        orm_mode = True






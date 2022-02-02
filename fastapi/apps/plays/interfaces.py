from typing import Optional, List
from pydantic import BaseModel


class PlayBaseModel(BaseModel):
    title: str
    description: str

class PlayModel(PlayBaseModel):
    id: int
    class Config:
        orm_mode = True



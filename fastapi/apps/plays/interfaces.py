from typing import Optional
from pydantic import BaseModel


class PlayModel(BaseModel):
    title: str
    description: str

class PlayWithImageModel(PlayModel):
    image: Optional[str]

class PlayCreateModel(PlayModel):
    pass

class PlayDatabaseModel(PlayWithImageModel):
    id: int
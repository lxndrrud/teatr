from typing import Optional, List
from pydantic import BaseModel


class PlayModel(BaseModel):
    title: str
    description: str

class PlayModelList(BaseModel):
    plays: List[PlayModel]

class PlayWithImageModel(PlayModel):
    image: Optional[str]

class PlayCreateModel(PlayModel):
    pass

class PlayUpdateModel(PlayCreateModel):
    title: Optional[str]
    description: Optional[str]

class PlayDatabaseModel(PlayWithImageModel):
    id: int

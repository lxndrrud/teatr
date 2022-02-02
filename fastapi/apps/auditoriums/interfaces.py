from pydantic import BaseModel
from typing import Optional

class AuditoriumBaseModel(BaseModel):
    title: str

class AuditoriumModel(AuditoriumBaseModel):
    id: int

    class Config:
        orm_mode = True

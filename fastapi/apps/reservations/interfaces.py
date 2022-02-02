from typing import Optional, List
from pydantic import BaseModel

class ReservationBaseModel(BaseModel):
    id_session: int
    id_record: int

class ReservationModel(ReservationBaseModel):
    id: int
    class Config:
            orm_mode = True

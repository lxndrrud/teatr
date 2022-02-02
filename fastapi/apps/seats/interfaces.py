from pydantic import BaseModel
from typing import Optional

class SeatBaseModel(BaseModel):
    number_row: int
    number_seat: int
    id_auditorium: int

class SeatModel(SeatBaseModel):
    id: int

    class Config:
        orm_mode = True



    


from typing import Optional, List
from pydantic import BaseModel, EmailStr
from datetime import datetime


class SlotInfoModel(BaseModel):
    price: float
    seat_number: int
    row_number: int
    auditorium: str

class ReservationBaseModel(BaseModel):
    id_session: int
    id_record: int

class ReservationUpdateModel(ReservationBaseModel):
    is_paid: bool
    code: str
    is_confirmed: bool
    confirmation_code: str
    datetime: datetime

class ReservationEmailModel(BaseModel):
    email: EmailStr
    id_session: int
    slots: List[int]

    class Config:
            orm_mode = True


class ReservationModel(ReservationBaseModel):
    id: int
    datetime: datetime
    is_paid: bool
    code: str
    is_confirmed: bool
    confirmation_code: str
    slots: List[SlotInfoModel]
    session_datetime: datetime
    play_title: str 

    class Config:
            orm_mode = True



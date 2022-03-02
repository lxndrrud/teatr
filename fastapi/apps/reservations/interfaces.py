from typing import Optional, List
from pydantic import BaseModel, EmailStr
from datetime import date, time


class SlotPostModel(BaseModel):
    id: int
    price: float
    seat_number: int
    row_number: int

class SlotInfoModel(SlotPostModel):
    auditorium: str

class ReservationBaseModel(BaseModel):
    id_session: int
    id_record: int

class ReservationUpdateModel(ReservationBaseModel):
    is_paid: bool
    code: str
    is_confirmed: bool
    confirmation_code: str
    time: date
    time: time

class ReservationEmailModel(BaseModel):
    email: EmailStr
    id_session: int
    slots: List[SlotPostModel]

    class Config:
            orm_mode = True


class ReservationModel(ReservationBaseModel):
    id: int
    date: date
    time: time
    is_paid: bool
    code: str
    is_confirmed: bool
    confirmation_code: str
    slots: List[SlotInfoModel]
    session_date: date
    session_time: time
    play_title: str 

    class Config:
            orm_mode = True

class ReservationPostResponseModel(BaseModel):
    id: int
    id_session: int
    code: str

class ReservationConfirmationModel(BaseModel):
    id_session: int
    code: str
    confirmation_code: str



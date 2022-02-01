from typing import Optional, List
from pydantic import BaseModel
from ..sessions.interfaces import SessionModel
from ..records.interfaces import RecordModel

class ReservationDatabaseModel(BaseModel):
    id: int
    id_session: int
    id_record: int

class ReservationCreateModel(ReservationDatabaseModel):
    id: None

class ReservationUpdateModel(ReservationCreateModel):
    id_session: Optional[int]
    id_record: Optional[int]

class ReservationModel(BaseModel):
    session: SessionModel
    record: RecordModel
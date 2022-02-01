from pydantic import BaseModel, EmailStr
from typing import Optional


class RecordModel(BaseModel):
    email: EmailStr
    firstname: Optional[str] 
    middlename: Optional[str] 
    lastname: Optional[str] 
    reservation_counter: int

class RecordDatabaseModel(RecordModel):
    id: int

class RecordCreateModel(RecordModel):
    reservation_counter: Optional[int]

class RecordUpdateModel(RecordCreateModel):
    email: Optional[EmailStr]
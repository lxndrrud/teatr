from pydantic import BaseModel, EmailStr
from typing import Optional


class RecordBaseModel(BaseModel):
    email: EmailStr
    firstname: Optional[str] 
    middlename: Optional[str] 
    lastname: Optional[str] 
    reservation_counter: int

class RecordModel(RecordBaseModel):
    id: int
    class Config:
        orm_mode = True

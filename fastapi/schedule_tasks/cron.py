from sqlalchemy.orm import Session as DBSession
from database import SessionLocal
from models import Session
from datetime import datetime

def is_fifteen_minutes_interval(datetime1: datetime, datetime2: datetime) -> bool:
    """
    Compare datetimes without seconds
    """
    # ! WARNING datetime1.minutes - datetime2.minutes < 15
    if datetime1.year - datetime2.year < 1 and datetime1.month - datetime2.month < 1 \
    and datetime1.day - datetime2.day < 1 and datetime1.hour - datetime2.hour < 1 and \
    datetime1.minute - datetime2.minute < 15 or datetime1 < datetime2:
        return True
    else:
        return False


def process_sessions(db: DBSession) -> None:
    """
    Lock sessions 
    """
    db = SessionLocal()
    query = db.query(Session).filter(Session.is_locked == False).order_by(Session.datetime.desc()).all()
    now_ = datetime.now()
    for row in query:
        if is_fifteen_minutes_interval(row.datetime, now_):
            row.is_locked = True
            db.add(row)
    db.commit()


def process_time() -> None:
    funcs_ = [process_sessions]
    for f in funcs_:
        db = SessionLocal()
        f(db)
        db.close()



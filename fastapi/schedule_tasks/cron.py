from sqlalchemy.orm import Session as DBSession
from database import SessionLocal
from models import Session, Reservation
from datetime import datetime

def is_fifteen_minutes_interval(datetime1: datetime, datetime2: datetime) -> bool:
    """
    Compare datetimes without seconds (less than 15 minutes or outdated)
    """
    # ! WARNING datetime1.minutes - datetime2.minutes < 15
    if datetime1.year - datetime2.year < 1 and datetime1.month - datetime2.month < 1 \
    and datetime1.day - datetime2.day < 1 and datetime1.hour - datetime2.hour < 1 \
    and datetime1.minute - datetime2.minute < 15 or datetime1 < datetime2:
        return True
    else:
        return False

def out_of_fifteen_minutes(datetime1: datetime, datetime2: datetime) -> bool:
    """
    Compare datetimes without seconds (more than 15 minutes)
    """
    # ! WARNING datetime1.minutes - datetime2.minutes > 15
    if datetime2.year > datetime1.year or datetime2.month > datetime1.month \
    or datetime2.day > datetime1.day or datetime2.hour > datetime1.hour \
    or datetime2.minute - datetime1.minute > 15:
        return True
    else:
        return False


def process_sessions(db: DBSession) -> None:
    """
    Lock outdated sessions and 15 minutes before sessions
    """
    query = db.query(Session).filter(Session.is_locked == False).order_by(Session.datetime.desc()).all()
    now_ = datetime.now()
    for row in query:
        if is_fifteen_minutes_interval(row.datetime, now_):
            row.is_locked = True
            db.add(row)
    db.commit()
    print('process sessions')


def process_reservations(db: DBSession) -> None:
    """
    Delete unconfirmed reservations
    """
    query = db.query(Reservation).filter(Reservation.is_confirmed == False).order_by(Reservation.datetime.desc()).all()
    now_ = datetime.now()
    for row in query:
        if out_of_fifteen_minutes(row.datetime, now_):
            db.delete(row)
    db.commit()
    print('process reservations')



def process_time() -> None:
    print(f'process time cron {datetime.now()}')
    funcs_ = [process_sessions, process_reservations]
    for f in funcs_:
        db = SessionLocal()
        f(db)
        db.close()



from sqlalchemy.orm import Session as DBSession
from database import SessionLocal
from models import Session, Reservation
from datetime import datetime

def is_fifteen_minutes_interval(datetime1, datetime2) -> bool:
    """
    Compare datetimes without seconds (less than 15 minutes or outdated)
    """
    # ! WARNING datetime1.minutes - datetime2.minutes < 15
    if datetime1["date"].year - datetime2["date"].year < 1 \
    and datetime1["date"].month - datetime2["date"].month < 1 \
    and datetime1["date"].day - datetime2["date"].day < 1 \
    and datetime1["time"].hour - datetime2["time"].hour < 1 \
    and datetime1["time"].minute - datetime2["time"].minute < 15 \
    or (datetime1["date"] < datetime2["date"] and datetime["time"] < datetime2["time"]):
        return True
    else:
        return False

def out_of_fifteen_minutes(datetime1, datetime2) -> bool:
    """
    Compare datetimes without seconds (more than 15 minutes)
    """
    # ! WARNING datetime1.minutes - datetime2.minutes > 15
    if datetime2["date"].year > datetime1["date"].year \
    or datetime2["date"].month > datetime1["date"].month \
    or datetime2["date"].day > datetime1["date"].day \
    or datetime2["time"].hour > datetime1["time"].hour \
    or datetime2["time"].minute - datetime1["time"].minute > 15:
        return True
    else:
        return False


def process_sessions(db: DBSession) -> None:
    """
    Lock outdated sessions and 15 minutes before sessions
    """
    query = db.query(Session).filter(Session.is_locked == False)\
        .order_by(Session.date.asc(), Session.date.asc()).all()
    now_ = {
        "date": datetime.now().date(),
        "time": datetime.now().time()
    }
    for row in query:
        row_ = {
            "date": row.date,
            "time": row.time
        }
        if is_fifteen_minutes_interval(row_, now_):
            row.is_locked = True
            db.add(row)
    db.commit()
    print('process sessions')


def process_reservations(db: DBSession) -> None:
    """
    Delete unconfirmed reservations
    """
    query = db.query(Reservation).filter(Reservation.is_confirmed == False)\
        .order_by(Reservation.date.asc(), Reservation.time.asc()).all()
    now_ = now_ = {
        "date": datetime.now().date(),
        "time": datetime.now().time()
    }
    for row in query:
        row_ = {
            "date": row.date,
            "time": row.time
        }
        if out_of_fifteen_minutes(row_, now_):
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



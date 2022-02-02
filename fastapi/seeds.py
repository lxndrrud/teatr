from database import SessionLocal
from sqlalchemy.orm import Session as PostgresSession
from models import Auditorium, Play, Session, Seat, Reservation, Record, ReservationsSeats
import datetime


def plays_seed(db: PostgresSession) -> None:
    try:
        print('Running Play seeds...')
        query = db.query(Play).all()
        if query != []:
            print('Deleting Play rows...')
            for i in query:
                db.delete(i)
        print('Inserting test rows...')
        new_row = Play(
            title = "Test title",
            description = "Test desc"
        )
        db.add(new_row)
        db.commit()
        print('Committed Play seeds!')
    except:
        db.rollback()
        print('Play seed failed!')

def sessions_seed(db: PostgresSession) -> None:
    try:
        print('Running Session seeds...')
        query = db.query(Session).all()
        if query != []:
            print('Deleting Session rows...')
            for i in query:
                db.delete(i)
        print('Inserting test rows...')
        new_row = Session(
            id_play = 1,
            datetime = datetime.datetime(2022, 3, 15, hour=10, minute=30),
            price = 200.0
        )
        db.add(new_row)
        db.commit()
        print('Committed Session seeds!')
    except:
        db.rollback()
        print('Session seed failed!')

def records_seed(db: PostgresSession) -> None:
    try:
        print('Running Record seeds...')
        query = db.query(Record).all()
        if query != []:
            print('Deleting Record rows...')
            for i in query:
                db.delete(i)
        print('Inserting test rows...')
        new_row = Record(
            email='test@mail.ru',
            firstname='Test',
            middlename='Test',
            lastname='Test',
        )
        db.add(new_row)
        db.commit()
        print('Committed Record seeds!')
    except:
        db.rollback()
        print('Record seed failed!')

def auditoriums_seed(db: PostgresSession) -> None:
    try:
        print('Running Auditorium seeds...')
        query = db.query(Auditorium).all()
        if query != []:
            print('Deleting Auditorium rows...')
            for i in query:
                db.delete(i)
        print('Inserting test rows...')
        new_row = Auditorium(
           title='Тестовый зал'
        )
        db.add(new_row)
        db.commit()
        print('Committed Auditorium seeds!')
    except:
        db.rollback()
        print('Auditorium seed failed!')

def seats_seed(db: PostgresSession) -> None:
    try:
        print('Running Seat seeds...')
        query = db.query(Seat).all()
        if query != []:
            print('Deleting Seat rows...')
            for i in query:
                db.delete(i)
        print('Inserting test rows...')
        new_row = Seat(
            number_seat=1,
            number_row=1,
            id_auditorium=1
        )
        db.add(new_row)
        db.commit()
        print('Committed Seat seeds!')
    except:
        db.rollback()
        print('Seat seed failed!')

        


def run_seeds() -> None:
    list_ = [plays_seed, sessions_seed, records_seed, auditoriums_seed, seats_seed]
    for f in list_:
        db = SessionLocal()
        f(db)
        db.close()


if __name__ == "__main__":
    run_seeds()

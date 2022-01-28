from database import SessionLocal
from sqlalchemy.orm import Session as PostgresSession
from models import Play, Session, Seat, Reservation, Record, ReservationsSeats


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
            title = "Тестовый спектакль",
            description = "Это самый интересный тестовый спектакль",
            image = "/storage/no-photo.png"
        )
        db.add(new_row)
        db.commit()
        print('Committed Play seeds!')
    except:
        db.rollback()
        print('Play seed failed!')
        


def run_seeds() -> None:
    list_ = [plays_seed]
    for f in list_:
        db = SessionLocal()
        f(db)
        db.close()


if __name__ == "__main__":
    run_seeds()

from fastapi import APIRouter, Depends, Response, Path
from database import get_db
from sqlalchemy.orm import Session as DBSession
from starlette import status

from ..sessions.interfaces import SessionModel, PlayModel
#from .interfaces import SessionModel, SessionCreateModel
from .interfaces import ReservationBaseModel, ReservationModel
from models import Reservation, ReservationsSeats, Record

router = APIRouter(
    prefix='/reservations',
    tags=['reservations', 'records', 'reservations_to_seats']
)

@router.get('/', status_code=status.HTTP_200_OK)
def get_reservations(db: DBSession = Depends(get_db)):
    query = db.query(Reservation).all()
    return query

@router.get('/{item_id}', response_model=ReservationModel)
def get_single(
    response: Response,
    item_id: int = Path(...),
    db: DBSession = Depends(get_db)):
    query = db.query(Reservation).filter(Reservation.id == item_id).first()
    if query:
        play = PlayModel(
            id=query.id,
            title=query.session.play.title,
            description=query.session.play.description
        )
        session = SessionModel(
            play=play,
            datetime=query.session.datetime,
            price=query.session.price
        )
        result = ReservationModel(
            session=session
        )
        response.status_code = status.HTTP_200_OK
        return result
    else:
        response.status_code = status.HTTP_404_NOT_FOUND

@router.post('/')
def post_reservation(
    response: Response,
    item: ReservationBaseModel,
    db: DBSession = Depends(get_db)):
    try:
        new_row = Reservation(
            id_session = item.id_record,
            id_record = item.id_session
        )
        db.add(new_row)
        db.commit()
        response.status_code = status.HTTP_201_CREATED
        return {"id": new_row.id}
    except:
        response.status_code = status.HTTP_415_UNSUPPORTED_MEDIA_TYPE

@router.delete('/{item_id}')
def delete_reservation(
    response: Response,
    item_id: int = Path(...),
    db: DBSession = Depends(get_db)):
    query = db.query(Record).filter(Record.id == item_id).first()
    if query:
        db.delete(query)
        db.commit()
        response.status_code = status.HTTP_200_OK
    else:
        response.status_code = status.HTTP_404_NOT_FOUND
    
@router.put('/{item_id}')
def update_reservation(
    response: Response,
    item: ReservationBaseModel,
    item_id: int = Path(...),
    db: DBSession = Depends(get_db)
):
    query = db.query(Reservation).filter(Reservation.id == item_id).first()
    if query:
        query.id_record = item.id_record
        query.id_session = item.id_session
        db.add(query)
        db.commit()
        response.status_code = status.HTTP_200_OK
    else:
        response.status_code = status.HTTP_404_NOT_FOUND

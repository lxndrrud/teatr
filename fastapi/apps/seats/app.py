from fastapi import APIRouter, Depends, Response, Path
from database import get_db
from sqlalchemy.orm import Session as DBSession
from starlette import status
from models import Seat
from .interfaces import SeatBaseModel, SeatModel


router = APIRouter(
    prefix='/seats',
    tags=['seats', 'auditoriums']
)

@router.get('/', status_code=status.HTTP_200_OK)
def get_seats(db: DBSession = Depends(get_db)):
    query = db.query(Seat).all()
    return query

@router.get('/{item_id}',  status_code=status.HTTP_200_OK, response_model=SeatModel)
def get_single(
    response: Response,
    item_id: int = Path(...),
    db: DBSession = Depends(get_db)):
    query = db.query(Seat).filter(Seat.id == item_id).first()
    if query:
        result = SeatModel.from_orm(query)
        return result
    else:
        response.status_code = status.HTTP_404_NOT_FOUND

@router.post('/', status_code=status.HTTP_201_CREATED)
def post_seat(
    response: Response,
    item: SeatBaseModel,
    db: DBSession = Depends(get_db)):
    try:
        new_row = Seat(
            number_row=item.number_row,
            number_seat=item.number_seat,
            id_auditorium=item.id_auditorium
        )
        db.add(new_row)
        db.commit()
        return {"id": new_row.id}
    except:
        db.rollback()
        response.status_code(status.HTTP_415_UNSUPPORTED_MEDIA_TYPE)

@router.put('/{item_id}', status_code=status.HTTP_200_OK)
def update_seat(
    response: Response,
    item: SeatBaseModel,
    item_id: int = Path(...),
    db: DBSession = Depends(get_db)):
    query = db.query(Seat).filter(Seat.id == item_id).first()
    if query:
        query.number_seat = item.number_seat
        query.id_auditorium = item.id_auditorium
        query.number_row = item.number_row
        db.add(query)
        db.commit()
    else:
        db.rollback()
        response.status_code = status.HTTP_404_NOT_FOUND

@router.delete('/{item_id}', status_code=status.HTTP_200_OK)
def delete_seat(
    response: Response,
    item_id: int = Path(...),
    db: DBSession = Depends(get_db)):
    query = db.query(Seat).filter(Seat.id == item_id).first()
    if query:
        db.delete(query)
        db.commit()
    else:
        db.rollback()
        response.status_code = status.HTTP_404_NOT_FOUND



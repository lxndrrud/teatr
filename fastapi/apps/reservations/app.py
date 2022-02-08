from fastapi import APIRouter, Depends, Response, Path
from database import get_db
from sqlalchemy.orm import Session as DBSession
from starlette import status

from .interfaces import ReservationModel, ReservationEmailModel, ReservationUpdateModel, SlotInfoModel
from models import Reservation, Record, ReservationsSlots, Slot
from random import randint, seed as random_seed

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
        reservations_slots = db.query(ReservationsSlots).filter(ReservationsSlots.id_reservation == item_id).all()
        slots = []
        for slot in reservations_slots:
            slot_info = SlotInfoModel(
                price=slot.slot.price,
                seat_number=slot.slot.seat.number,
                row_number=slot.slot.seat.row.number,
                auditorium=slot.slot.seat.row.auditorium.title
            )
            slots.append(slot_info)
        
        result = ReservationModel(
            id=query.id,
            id_session=query.id_session,
            id_record=query.id_record,
            datetime=query.datetime,
            is_paid=query.is_paid, 
            code=query.code,
            is_confirmed=query.is_confirmed,
            confirmation_code=query.confirmation_code,
            slots=slots,
            session_datetime=query.session.datetime,
            play_title=query.session.play.title
        )
        response.status_code = status.HTTP_200_OK
        return result
    else:
        response.status_code = status.HTTP_404_NOT_FOUND

@router.post('/')
def post_reservation(
    response: Response,
    item: ReservationEmailModel,
    db: DBSession = Depends(get_db)):
    try:
        random_seed()
        query = db.query(Record).filter(Record.email == item.email).first()
        _record_id = 0
        if query:
            _record_id = query.id
        else:
            new_record = Record(
                email=item.email
            )
            db.add(new_record)
            db.commit()
            _record_id = new_record.id
        new_code = f"{randint(0,9)}{randint(0,9)}{randint(0,9)}{randint(0,9)}{randint(0,9)}{randint(0,9)}"
        new_confirmation_code = f"{randint(0,9)}{randint(0,9)}{randint(0,9)}{randint(0,9)}{randint(0,9)}{randint(0,9)}"
        new_reservation = Reservation(
            code = new_code,
            is_paid = False,
            confirmation_code = new_confirmation_code,
            is_confirmed = False,
            id_session = _record_id,
            id_record = item.id_session
        )
        db.add(new_reservation)
        db.commit()

        for slot in item.slots:
            new_reservation_slots = ReservationsSlots(
                id_slot=slot,
                id_reservation=new_reservation.id
            )
            db.add(new_reservation_slots)
        db.commit()
        
        response.status_code = status.HTTP_201_CREATED
        return {"id": new_reservation.id}
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
    item: ReservationUpdateModel,
    item_id: int = Path(...),
    db: DBSession = Depends(get_db)
):
    query = db.query(Reservation).filter(Reservation.id == item_id).first()
    if query:
        query.id_record = item.id_record
        query.id_session = item.id_session
        query.is_paid = item.is_paid
        query.is_confirmed = item.is_confirmed
        query.code = item.code
        query.confirmation_code = item.confirmation_code
        query.datetime = item.datetime
        db.add(query)
        db.commit()
        response.status_code = status.HTTP_200_OK
    else:
        response.status_code = status.HTTP_404_NOT_FOUND


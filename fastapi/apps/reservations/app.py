from fastapi import APIRouter, Body, Depends, Response, Path, BackgroundTasks
from database import get_db
from sqlalchemy.orm import Session as DBSession
from sqlalchemy import and_
from starlette import status

from .interfaces import ReservationConfirmationModel, ReservationModel, ReservationEmailModel, ReservationUpdateModel, SlotInfoModel
from .utils import send_confirmation_email, generate_code, formatStrFromDatetime
from models import Reservation, Record, ReservationsSlots, Session

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
    background_tasks: BackgroundTasks,
    item: ReservationEmailModel,
    db: DBSession = Depends(get_db)):
    try: 
        record_query = db.query(Record).filter(Record.email == item.email).first()
        session_query = db.query(Session).filter(Session.id == item.id_session).first()
        if session_query.is_locked == True:
            response.status_code = status.HTTP_403_FORBIDDEN
            return
        _record_id = 0
        if record_query:
            _record_id = record_query.id
        else:
            new_record = Record(
                email=item.email
            )
            db.add(new_record)
            db.commit()
            _record_id = new_record.id
        new_code = generate_code()
        new_confirmation_code = generate_code()
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
        
        background_tasks \
            .add_task(send_confirmation_email, item.email, new_confirmation_code, \
                new_code, session_query.play.title, \
                formatStrFromDatetime(session_query.datetime), \
                session_query.price_policy.slots[0].seat.row.auditorium.title)

        response.status_code = status.HTTP_201_CREATED
        return {"id": new_reservation.id, 
            "id_session": new_reservation.id_session, 
            "code": new_reservation.code,
            "confirmation_code": new_reservation.confirmation_code
        }
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

@router.put('/confirm/{item_id}')
def confirm_reservation(
    response: Response,
    item: ReservationConfirmationModel,
    item_id: int = Path(...),
    db: DBSession = Depends(get_db)):
    print(item)
    query = db.query(Reservation) \
        .filter(and_(Reservation.id == item_id, Reservation.code == item.code, Reservation.id_session == item.id_session)) \
        .first()
    if query:
        if query.confirmation_code == item.confirmation_code:
            query.is_confirmed = True
            db.add(query)
            db.commit()
            response.status_code = status.HTTP_200_OK
        else:
            response.status_code = status.HTTP_412_PRECONDITION_FAILED
    else:
        response.status_code = status.HTTP_404_NOT_FOUND
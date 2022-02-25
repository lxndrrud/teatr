from datetime import datetime
from ntpath import join
from fastapi import APIRouter, Depends, Response, Path, UploadFile
from database import get_db
from sqlalchemy.orm import Session as DBSession
from sqlalchemy import and_
from starlette import status
from .interfaces import SessionModel, SessionBaseModel
from .utils import formatDate, formatTime
from models import PricePolicy, ReservationsSlots, Row, Seat, Session, Slot
import os, sys
from pathlib import Path as sys_path
from datetime import datetime


sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), os.path.pardir))
)

router = APIRouter(
    prefix="/sessions",
    tags=['sessions'])

@router.get('/', status_code=status.HTTP_200_OK)
def get_sessions(db: DBSession = Depends(get_db)):
    query = db.query(Session) \
        .filter(Session.is_locked == False) \
        .order_by(Session.date.asc(), Session.time.asc()) \
        .all()
    list_ = []
    for row in query:
        auditorium_title = row.price_policy.slots[0].seat.row.auditorium.title
        new_row = SessionModel(
            id=row.id,
            is_locked=row.is_locked,
            id_play=row.id_play,
            id_price_policy=row.id_price_policy,
            date=row.date,
            time=row.time,
            auditorium_title=auditorium_title,
            play_title=row.play.title
        )
        list_.append(new_row)
    return list_

@router.get('/{item_id}', response_model=SessionModel)
def get_single(response: Response,
    item_id: int = Path(...), 
    db: DBSession = Depends(get_db),):
    query = db.query(Session).filter(Session.id == item_id).first()
    if query:
        auditorium_title = query.price_policy.slots[0].seat.row.auditorium.title
        result = SessionModel(
            id=query.id,
            is_locked=query.is_locked,
            id_play=query.id_play,
            id_price_policy=query.id_price_policy,
            date=query.date,
            time=query.time,
            auditorium_title=auditorium_title,
            play_title=query.play.title
        )
        return result
    else:
        response.status_code = status.HTTP_404_NOT_FOUND

@router.post('/')
def post_session(
    item: SessionBaseModel,
    response: Response, 
    db: DBSession = Depends(get_db)):
    try:
        new_row = Session(
            id_play = item.id_play,
            id_price_policy = item.id_price_policy,
            date=item.date,
            time=item.time
        )
        db.add(new_row)
        db.commit()
        response.status_code = status.HTTP_201_CREATED
        return {"id": new_row.id}
    except:
        response.status_code = status.HTTP_415_UNSUPPORTED_MEDIA_TYPE

@router.delete('/{item_id}')
def delete_session(
    response: Response,
    item_id: int = Path(...),
    db: DBSession = Depends(get_db)):
    query = db.query(Session).filter(Session.id == item_id).first()
    if query:
        db.delete(query)
        db.commit()
        response.status_code = status.HTTP_200_OK
    else:
        response.status_code = status.HTTP_404_NOT_FOUND

@router.put('/{item_id}')
def update_session(
    response: Response,
    item: SessionBaseModel,
    item_id: int = Path(...),
    db: DBSession = Depends(get_db)):
    query = db.query(Session).filter(Session.id == item_id).first()
    if query:
        query.is_locked = item.is_locked
        query.dateitem.date
        query.time = item.time
        query.id_play = item.id_play
        query.price = item.price
        db.add(query)
        db.commit()
        response.status_code = status.HTTP_200_OK
    else:
        response.status_code = status.HTTP_404_NOT_FOUND

@router.get('/play/{item_id}', status_code=status.HTTP_200_OK)
def get_sessions_by_play(
    response: Response,
    item_id: int = Path(...),
    db: DBSession = Depends(get_db)):
    query = db.query(Session).filter(and_(Session.is_locked == False, Session.id_play == item_id)) \
        .order_by(Session.date.desc(), Session.time.desc()).all()

    
    if query: 
        list_ = []
        for row in query:
            auditorium_title = row.price_policy.slots[0].seat.row.auditorium.title
            new_row = SessionModel(
                id=row.id,
                is_locked=row.is_locked,
                id_play=row.id_play,
                id_price_policy=row.id_price_policy,
                date=row.date,
                time=row.time,
                auditorium_title=auditorium_title,
                play_title=row.play.title
            )
            list_.append(new_row)
        return list_
    else:
        response.status_code = status.HTTP_404_NOT_FOUND


@router.post('/csv', status_code=status.HTTP_201_CREATED)
async def post_sessions_csv(
    csv_file: UploadFile,
    db: DBSession = Depends(get_db)):
    content = await csv_file.read()
    my_path = sys_path(__file__).parent.parent.parent / 'storage' / 'csv_files' / f'{datetime.now()}_sessions_{csv_file.filename}'
    with open(my_path, 'wb') as f:
        f.write(content)
    plays_array = []
    with open(my_path, 'r') as f:
        content = f.read().split('\n')[:-1]
        counter = 1
        for row in content:
            if counter == 1:
                counter += 1
                continue
            try:
                row_content = row.split('%')
                
                date = formatDate(row_content[0])
                time = formatTime(row_content[1])
                is_locked = True if row_content[2] == 'Д' else False 
                id_play = row_content[3]
                id_price_policy = row_content[4] 
                new_row = Session(
                    date=date,
                    time=time,
                    is_locked = is_locked,
                    id_play = id_play,
                    id_price_policy = id_price_policy)
                plays_array.append(new_row)
            except:
                print(f'CSV Session row failed: Номер строки = "{counter}"')
            counter += 1
    for row in plays_array:
        db.add(row)
    db.commit()
    ids_array = []
    for row in plays_array:
        ids_array.append(row.id)
    return ids_array



@router.get('/{item_id}/slots')
def get_slots_for_sessions(
    response: Response, 
    item_id: int =  Path(...), 
    db: DBSession = Depends(get_db)):
    session_query = db.query(Session).filter(Session.id == item_id).first()
    if session_query:
        rows_query = db \
            .query(Row.id, Row.number) \
            .filter(Slot.id_price_policy == session_query.price_policy.id) \
            .join(Seat, Seat.id_row == Row.id) \
            .join(Slot, Slot.id_seat == Seat.id) \
            .all()
        slots_query = db \
            .query(Slot.id, Row.id.label('id_row'), Seat.number.label('seat_number'), 
                Row.number.label('row_number'), Slot.price) \
            .filter(Slot.id_price_policy == session_query.price_policy.id) \
            .join(Seat, Seat.id == Slot.id_seat) \
            .join(Row,  Row.id == Seat.id_row) \
            .all()
        reserved_slots_query = db \
            .query(Slot.id, Row.id.label('id_row'), Seat.number.label('seat_number'), 
                Row.number.label('row_number'), Slot.price) \
            .filter(Slot.id_price_policy == session_query.price_policy.id) \
            .join(Seat, Seat.id == Slot.id_seat) \
            .join(Row,  Row.id == Seat.id_row) \
            .join(ReservationsSlots, ReservationsSlots.id_slot == Slot.id) \
            .all()
        result = []
        for row in rows_query:
            row_reserved_slots = reserved_slots_query.filter(lambda x: x.id_row == row.id)
            row_slots = slots_query.filter(lambda x: x.id_row == row.id)
        response.status_code = status.HTTP_200_OK
        return slots_query
    else:
        response.status_code = status.HTTP_404_NOT_FOUND
    

    




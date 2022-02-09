from datetime import datetime
from fastapi import APIRouter, Depends, Response, Path, UploadFile
from database import get_db
from sqlalchemy.orm import Session as DBSession
from starlette import status
from .interfaces import SessionModel, SessionBaseModel
from models import Session
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
    query = db.query(Session).order_by(Session.datetime).all()
    list_ = []
    for row in query:
        auditorium_title = row.price_policy.slots[0].seat.row.auditorium.title
        new_row = SessionModel(
            id=row.id,
            id_play=row.id_play,
            id_price_policy=row.id_price_policy,
            datetime=row.datetime,
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
            id_play=query.id_play,
            id_price_policy=query.id_price_policy,
            datetime=query.datetime,
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
            datetime=item.datetime,
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
        query.datetime = item.datetime
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
    query = db.query(Session).filter(Session.id_play == item_id).order_by(Session.datetime.desc()).all()

    
    if query: 
        list_ = []
        for row in query:
            auditorium_title = row.price_policy.slots[0].seat.row.auditorium.title
            new_row = SessionModel(
                id=row.id,
                id_play=row.id_play,
                id_price_policy=row.id_price_policy,
                datetime=row.datetime,
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
        counter = 0
        for row in content:
            if counter == 0:
                counter += 1
                continue
            try:
                row_content = row.split('%')
                #datetime csv format: "dd-mm-yyyy hh:mm"
                _datetime_content = row_content[0].split(' ')
                _date = _datetime_content[0].split("-")
                _time = _datetime_content[1].split(":")
                _datetime = datetime(year=int(_date[2]), month=int(_date[1]), day=int(_date[0]), hour=int(_time[0]), minute=int(_time[1]))
                _id_play = row_content[1]
                _id_price_policy = row_content[2] 
                new_row = Session(
                    datetime = _datetime,
                    id_play = _id_play,
                    id_price_policy = _id_price_policy)
                plays_array.append(new_row)
            except:
                print(f'CSV Session row failed: "{_datetime}", "{_id_play}", "{_id_price_policy}"')
    for row in plays_array:
        db.add(row)
    db.commit()
    ids_array = []
    for row in plays_array:
        ids_array.append(row.id)
    return ids_array




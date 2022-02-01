from datetime import datetime
from fastapi import APIRouter, Depends, Response, Path
from database import get_db
from sqlalchemy.orm import Session as DBSession
from starlette import status
from .interfaces import SessionModel, SessionCreateModel, SessionUpdateModel
from ..plays.interfaces import PlayModel
from models import Session

router = APIRouter(
    prefix="/sessions",
    tags=['sessions'])

@router.get('/', status_code=status.HTTP_200_OK)
def get_sessions(db: DBSession = Depends(get_db)):
    query = db.query(Session).order_by(Session.datetime).all()
    return query

@router.get('/{item_id}', response_model=SessionModel)
def get_single(response: Response,
    item_id: int = Path(...), 
    db: DBSession = Depends(get_db),):
    query = db.query(Session).filter(Session.id == item_id).first()
    if query:
        play = query.play
        play = PlayModel(
            title=play.title,
            description=play.description
        )
        result = SessionModel(
            play=play,
            price=query.price,
            datetime=query.datetime
        )
        return result
    else:
        response.status_code = status.HTTP_404_NOT_FOUND

@router.post('/')
def post_session(
    item: SessionCreateModel,
    response: Response, 
    db: DBSession = Depends(get_db)):
    try:
        new_row = Session(
            id_play = item.id_play,
            datetime=item.datetime,
            price=item.price
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
    item: SessionUpdateModel,
    item_id: int = Path(...),
    db: DBSession = Depends(get_db)):
    query = db.query(Session).filter(Session.id == item_id).first()
    if query:
        if item.datetime:
            query.datetime = item.datetime
        if item.id_play:
            query.id_play = item.id_play
        if item.price:
            query.price = item.price
        db.add(query)
        db.commit()
        response.status_code = status.HTTP_200_OK
    else:
        response.status_code = status.HTTP_404_NOT_FOUND





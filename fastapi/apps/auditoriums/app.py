from fastapi import APIRouter, Depends, Response, Path
from database import get_db
from sqlalchemy.orm import Session as DBSession
from starlette import status
from models import Auditorium
from .interfaces import AuditoriumModel, AuditoriumBaseModel


router = APIRouter(
    prefix='/auditoriums',
    tags=['auditoriums']
)

@router.get('/', status_code=status.HTTP_200_OK)
def get_auditoriums(db: DBSession = Depends(get_db)):
    query = db.query(Auditorium).all()
    return query

@router.get('/{item_id}', response_model=AuditoriumModel)
def get_single(
    response: Response,
    item_id: int = Path(...),
    db: DBSession = Depends(get_db)):
    query = db.query(Auditorium).filter(Auditorium.id == item_id).first()
    if query: 
        result = AuditoriumModel(
            id=query.id, 
            title=query.title)
        response.status_code = status.HTTP_200_OK
        return result
    else:
        response.status_code = status.HTTP_404_NOT_FOUND

@router.post('/')
def post_auditorium(
    response: Response,
    item: AuditoriumBaseModel,
    db: DBSession = Depends(get_db)):
    try:
        new_row = Auditorium(title=item.title)
        db.add(new_row)
        db.commit()
        response.status_code = status.HTTP_201_CREATED
        return {"id": new_row.id}
    except:
        db.rollback()
        response.status_code = status.HTTP_415_UNSUPPORTED_MEDIA_TYPE


@router.put('/{item_id}', status_code=status.HTTP_200_OK)
def update_auditorium(
    response: Response,
    item: AuditoriumBaseModel,
    item_id: int = Path(...),
    db: DBSession = Depends(get_db)):
    query = db.query(Auditorium).filter(Auditorium.id == item_id).first()
    if query:
        query.title = item.title
        response.status_code = status.HTTP_200_OK
        db.add(query)
        db.commit()
    else:
        response.status_code = status.HTTP_404_NOT_FOUND

@router.delete('/{item_id}', status_code=status.HTTP_200_OK)
def delete_auditorium(
    response: Response,
    item_id: int = Path(...),
    db: DBSession = Depends(get_db)):
    query = db.query(Auditorium).filter(Auditorium.id == item_id).first()
    if query:
        db.delete(query)
        db.commit()
    else:
        db.rollback()
        response.status_code = status.HTTP_404_NOT_FOUND


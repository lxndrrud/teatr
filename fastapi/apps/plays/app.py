from sqlalchemy.orm import Session as DBSession
from database import get_db
from models import Play
from fastapi import APIRouter, Depends, Response, Path, UploadFile
from starlette import status
from typing import Optional
from .interfaces import PlayModel, PlayBaseModel
from .utils import image_saving


router = APIRouter(
        prefix="/plays",
        tags=['plays']
    )

@router.get('/', status_code=status.HTTP_200_OK)
def get_plays(db: DBSession = Depends(get_db)):
    query = db.query(Play).all()
    return query

@router.post('/', status_code=status.HTTP_201_CREATED)
def post_play(
        item: PlayModel, 
        response: Response,
        db: DBSession = Depends(get_db), ):
    try:
        new_row = Play(
            title=item.title,
            description=item.description
        )
        db.add(new_row)
        db.commit()
        response.status_code = status.HTTP_201_CREATED
        return {"id": new_row.id}
    except:
        db.rollback()
        response.status_code = status.HTTP_415_UNSUPPORTED_MEDIA_TYPE

@router.get('/{item_id}', status_code=status.HTTP_200_OK, response_model=PlayModel)
def get_single(
    response: Response,
    item_id: int = Path(...), 
    db: DBSession = Depends(get_db),
):
    query = db.query(Play).filter(Play.id == item_id).first()
    if query:
        result = PlayModel(
            id=query.id,
            title=query.title, 
            description=query.description, 
        )
        return result
    else:
        response.status_code = status.HTTP_404_NOT_FOUND

@router.delete('/{item_id}', status_code=status.HTTP_200_OK)
def delete_single(
    response: Response, 
    item_id: int = Path(...),
    db: DBSession = Depends(get_db),
): 
    query = db.query(Play).filter(Play.id == item_id).first()
    if query:
        db.delete(query)
        db.commit()
    else:
        response.status_code = status.HTTP_404_NOT_FOUND

@router.put('/{item_id}')
def update_play(
    response: Response, 
    item: PlayBaseModel,
    item_id: int = Path(...),
    db: DBSession = Depends(get_db)):
    query = db.query(Play).filter(Play.id == item_id).first()
    if query:
        query.description = item.description
        query.title = item.title
        db.add(query)
        db.commit()
        response.status_code = status.HTTP_200_OK
    else:
        response.status_code = status.HTTP_404_NOT_FOUND







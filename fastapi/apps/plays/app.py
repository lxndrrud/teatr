from sqlalchemy.orm import Session
from database import get_db
from models import Play
from fastapi import APIRouter, Depends, Response, Path, UploadFile
from starlette import status
from typing import Optional
from .interfaces import PlayModel, PlayCreateModel, PlayWithImageModel, PlayDatabaseModel, PlayModelList
from .utils import image_saving


router = APIRouter(
        prefix="/plays",
        tags=['plays']
    )

@router.get('/', status_code=status.HTTP_200_OK)
def get_plays(db: Session = Depends(get_db)):
    query = db.query(Play).all()
    return query

@router.post('/', status_code=status.HTTP_201_CREATED)
def post_play(
        item: PlayCreateModel, 
        response: Response,
        db: Session = Depends(get_db), ):
    try:
        new_row = Play(
            title=item.title,
            description=item.description
        )
        db.add(new_row)
        db.commit()
        response.status_code = status.HTTP_201_CREATED
        #response.headers['Location'] = f"/plays/{new_row.id}"
        return {"id": new_row.id}
    except:
        db.rollback()
        response.status_code = status.HTTP_415_UNSUPPORTED_MEDIA_TYPE

@router.get('/{item_id}', status_code=status.HTTP_200_OK, response_model=PlayModel)
def get_single(
    response: Response,
    item_id: int = Path(...), 
    db: Session = Depends(get_db),
):
    query = db.query(Play).filter(Play.id == item_id).first()
    if query:
        result = PlayModel(
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
    db: Session = Depends(get_db),
): 
    query = db.query(Play).filter(Play.id == item_id).first()
    if query:
        db.delete(query)
        db.commit()
    else:
        response.status_code = status.HTTP_404_NOT_FOUND






from fastapi import APIRouter, Depends, Response, Path
from database import get_db
from sqlalchemy.orm import Session as DBSession
from starlette import status
from models import Record
from .interfaces import RecordModel, RecordBaseModel


router = APIRouter(
    prefix='/records',
    tags=['records']
)

@router.get('/', status_code=status.HTTP_200_OK)
def get_records(db: DBSession = Depends(get_db)):
    query = db.query(Record).all()
    return query

@router.get('/{item_id}', response_model=RecordModel)
def get_single(
    response: Response,
    item_id:int = Path(...),
    db: DBSession = Depends(get_db)):
    query = db.query(Record).filter(Record.id == item_id).first()
    if query:
        result = RecordModel(
            id=query.id,
            email=query.email,
            firstname=query.firstname,
            middlename=query.middlename, 
            lastname=query.lastname,
            reservation_counter=query.reservation_counter
        )
        response.status_code = status.HTTP_200_OK
        return result
    else:
        response.status_code = status.HTTP_404_NOT_FOUND

@router.post('/')
def post_record(
    item: RecordBaseModel,
    response: Response,
    db: DBSession = Depends(get_db)):
    try:
        new_row = Record(
            email=item.email,
            firstname=item.firstname,
            middlename=item.middlename,
            lastname=item.lastname
        )
        db.add(new_row)
        db.commit()
        response.status_code = status.HTTP_201_CREATED
        return {"id": new_row.id}
    except:
        response.status_code = status.HTTP_415_UNSUPPORTED_MEDIA_TYPE


@router.delete('/{item_id}')
def delete_record(
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


@router.put('/{item_id}', )
def update_record(
    response: Response,
    item: RecordBaseModel,
    item_id: int = Path(...),
    db: DBSession = Depends(get_db)
):
    query = db.query(Record).filter(Record.id == item_id).first()
    if query:
        query.email = item.email
        query.firstname = item.firstname
        query.middlename = item.middlename
        query.lastname = item.lastname
        query.reservation_counter = item.reservation_counter
        db.add(query)
        db.commit()
        response.status_code = status.HTTP_200_OK
    else:
        response.status_code = status.HTTP_404_NOT_FOUND









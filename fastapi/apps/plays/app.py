from database import get_db
from models import Play
from fastapi import APIRouter, Depends

router = APIRouter(tags=['plays'])

@router.get('/')
def get_plays(db: Depends(get_db)):
    query = Play.query.all()
    return 
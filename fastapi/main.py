from apps.plays import app as plays_app
from apps.sessions import app as sessions_app
from apps.records import app as records_app
from apps.reservations import app as reservations_app
#from apps.auditoriums import app as auditoriums_app
#from apps.seats import app as seats_app

from fastapi import FastAPI, APIRouter


app = FastAPI(
    title='Приложение театра'
)

prefix_router = APIRouter(prefix='/fastapi')


prefix_router.include_router(plays_app.router)
prefix_router.include_router(sessions_app.router)
prefix_router.include_router(records_app.router)
prefix_router.include_router(reservations_app.router)
#app.include_router(auditoriums_app.router)
#app.include_router(seats_app.router)

@prefix_router.get("/")
#@app.get("/")
def index():
    return {"message": "test"}

app.include_router(prefix_router)



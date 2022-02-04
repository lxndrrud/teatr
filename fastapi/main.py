from apps.plays import app as plays_app
from apps.sessions import app as sessions_app
from apps.records import app as records_app
from apps.reservations import app as reservations_app
#from apps.auditoriums import app as auditoriums_app
#from apps.seats import app as seats_app

from fastapi import FastAPI


app = FastAPI(
    title='Приложение театра'
)

app.include_router(plays_app.router)
app.include_router(sessions_app.router)
app.include_router(records_app.router)
app.include_router(reservations_app.router)
#app.include_router(auditoriums_app.router)
#app.include_router(seats_app.router)


@app.get("/")
def index():
    return {"message": "test"}
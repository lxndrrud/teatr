from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore
from apscheduler.executors.pool import ThreadPoolExecutor, ProcessPoolExecutor
from database import SQLALCHEMY_DATABASE_URL
from pytz import timezone
from schedule_tasks.cron import process_time


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


jobstores = {
    'default': SQLAlchemyJobStore(url=SQLALCHEMY_DATABASE_URL)
}
executors = {
    'default': ThreadPoolExecutor(20),
    'processpool': ProcessPoolExecutor(5)
}
job_defaults = {
    'coalesce': False,
    'max_instances': 3
}
scheduler = AsyncIOScheduler(jobstores=jobstores, executors=executors, \
    job_defaults=job_defaults, \
    timezone=timezone('Europe/Moscow'))


@app.on_event('startup')
def call_scheduled_jobs():
    scheduler.add_job(process_time, 'interval', \
        id='server_process_time', minutes=1, replace_existing=True)
    scheduler.start()

@app.on_event('shutdown')
def uncall_scheduled_jobs():
    scheduler.remove_all_jobs()
    





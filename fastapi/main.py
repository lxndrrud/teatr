from apps.plays import app as plays_app
from fastapi import FastAPI


app = FastAPI()

app.include_router(plays_app.router)

@app.get("/")
def index():
    return {"message": "test"}
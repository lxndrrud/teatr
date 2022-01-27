from fcntl import FASYNC
from fastapi import FastAPI


app = FastAPI()

@app.get("/")
def index():
    return {"message": "test"}
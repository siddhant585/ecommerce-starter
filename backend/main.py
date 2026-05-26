from fastapi import FastAPI
from database import get_db_connection, close_db_connection

app = FastAPI(title="API")

@app.get("/")
def root():
    return {"message": "Hello, World!"}

@app.on_event("startup")
async def startup_event():
    print("Database connected")

@app.on_event("shutdown")
async def shutdown_event():
    close_db_connection()
    print("Database disconnected")
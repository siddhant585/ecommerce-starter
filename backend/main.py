from fastapi import FastAPI
from database import get_db_connection, close_db_connection
from routers import products, sessions, carts, checkout
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(title="API")
#CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://ecommerce-starter-rose.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(products.router, prefix="/products", tags=["products"])
app.include_router(sessions.router, prefix="/sessions", tags=["sessions"])
app.include_router(carts.router, prefix="/carts", tags=['carts'])
app.include_router(checkout.router, prefix="/checkout", tags=['checkout'])

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
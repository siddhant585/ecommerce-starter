import secrets
from fastapi import APIRouter, HTTPException, Header
from database import get_db_connection
import psycopg2.extras
from datetime import datetime, timedelta

router = APIRouter()

#no pydantic models for sessions

@router.post("/")
def create_session():
    token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(hours=1)
    with get_db_connection() as conn:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            "INSERT INTO sessions (token, expires_at) VALUES (%s, %s)",
            (token, expires_at)
        )
        conn.commit()
        return {"token": token}

#this is not an endpoint it is a helper function for the cart endpoints
def get_session(authorization: str = Header(..., description="Bearer token")):
    token = authorization.split()[1]
    with get_db_connection() as conn: 
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("SELECT * FROM sessions WHERE token = %s AND expires_at > NOW()", (token,))
        session = cur.fetchone()
        if not session:
            raise HTTPException(status_code=401, detail="Invalid or expired session")
        return session


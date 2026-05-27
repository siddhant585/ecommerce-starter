import psycopg2.extras
from fastapi import APIRouter, HTTPException, Depends
from routers.sessions import get_session
from database import get_db_connection
from pydantic import BaseModel

router = APIRouter()

#cart pydantic models
class CartItemCreate(BaseModel):
    product_id: int
    quantity: int

class CartItemUpdate(BaseModel):
    quantity: int

@router.post("/")
def add_to_cart(item: CartItemCreate, session = Depends(get_session)):
    with get_db_connection() as conn:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            "INSERT INTO cart_items (session_token, product_id, quantity) VALUES (%s, %s, %s) ON CONFLICT (session_token, product_id) DO UPDATE SET quantity = cart_items.quantity + %s RETURNING quantity",
            (session["token"], item.product_id, item.quantity, item.quantity)
        )
        quantity = cur.fetchone()["quantity"]
        conn.commit()
        return {"quantity": quantity}
    
@router.get("/")
def get_cart(session = Depends(get_session)):
    with get_db_connection() as conn:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            "SELECT * FROM cart_items WHERE session_token = %s", (session["token"],)
        )
        cart_items = cur.fetchall()
        return cart_items

@router.delete("/{product_id}")
def delete_from_cart(product_id: int, session = Depends(get_session)):
    with get_db_connection() as conn:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            'DELETE FROM cart_items WHERE session_token = %s AND product_id = %s', (session["token"], product_id) 
        )
        conn.commit()
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Item not found in cart")
        return {"message": "Item deleted from cart"}

@router.put("/{product_id}")
def  update_order_with_quantity(product_id: int, item: CartItemUpdate, session = Depends(get_session)):
    with get_db_connection() as conn:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute( 
            "UPDATE cart_items SET quantity = %s WHERE session_token = %s AND product_id = %s",(item.quantity, session["token"], product_id)
        )
        conn.commit()
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Item not found in cart")
        return {"message": "Item quantity updated"}
#this file is going to handle checkout logic -> with concurrency handling
from fastapi import APIRouter, HTTPException, Depends
from routers.sessions import get_session
from database import get_db_connection
import psycopg2.extras

router = APIRouter()

#no pydantic models for checkout

#flow of one transaction: 
 # For each item in cart_items for this session — SELECT ... FOR UPDATE on the product rows
 #   (this locks them so two concurrent checkouts can't both read stock=1 and both succeed)
 # 2. Validate every product has enough stock — if any fail, rollback and return 400 "out of stock"
 # 3. Decrement stock on each product
 # 4. Insert one row into orders (gets you the order_id)
 # 5. Insert rows into order_items — one per cart item, with price_cents_at_purchase
 #    snapshotted from the product (important: price could change after order)
 # 6. Delete the cart_items for this session (cart is now empty)
 # 7. Commit

@router.post("/")
def checkout(session = Depends(get_session)):
    with get_db_connection() as conn:
        try:
            cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
            cur.execute(

                #For each item in cart_items for this session — SELECT ... FOR UPDATE on the product rows (this locks them so two concurrent checkouts can't both read stock=1 and both succeed)
                "SELECT p.*, ci.quantity FROM products p JOIN cart_items ci on p.id = ci.product_id WHERE ci.session_token = %s FOR UPDATE", (session["token"],)

            )
            products = cur.fetchall()
            if not products:
                raise HTTPException(status_code = 404, detail = "No products found in cart")
            for product in products:
                if product['stock_quantity'] < product['quantity']:
                    raise HTTPException(status_code = 400, detail = "Product out of stock")
                cur.execute(
                    #Decrement stock on each product
                    "UPDATE products SET stock_quantity = stock_quantity - %s WHERE id = %s", (product['quantity'], product['id'])
                )
            total_cents = sum(product['price_cents'] * product['quantity'] for product in products) #total price of the order
            cur.execute(
                'INSERT INTO orders (session_token, total_cents) VALUES (%s, %s) RETURNING id', (session["token"], total_cents)
            )
            order_id = cur.fetchone()['id']
            for product in products:
                cur.execute(
                    'INSERT INTO order_items (order_id, product_id, quantity, price_cents_at_purchase) VALUES (%s, %s, %s, %s)', (order_id, product['id'], product['quantity'], product['price_cents'])
                )
            cur.execute(
                'DELETE FROM cart_items WHERE session_token = %s', (session["token"],)
            )
            conn.commit()
            return {"order_id": order_id}
        except HTTPException:
            conn.rollback()
            raise
        except Exception:
            conn.rollback()
            raise HTTPException(status_code=500, detail="Checkout failed")
    

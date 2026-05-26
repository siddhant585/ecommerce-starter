from fastapi import APIRouter, HTTPException
from database import get_db_connection
from pydantic import BaseModel
from typing import Optional
import psycopg2.extras

router = APIRouter()

#product pydantic models
class ProductCreate(BaseModel):
    name: str
    description: str
    price_cents: int
    category: str
    brand: str
    sku: str
    cover_image_url: str
    stock_quantity: int

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price_cents: Optional[int] = None
    category: Optional[str] = None
    brand: Optional[str] = None
    sku: Optional[str] = None
    cover_image_url: Optional[str] = None
    stock_quantity: Optional[int] = None

@router.post("/")
def create_product(product: ProductCreate):
    with get_db_connection() as conn:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            "INSERT INTO products (name, description, price_cents, category, brand, sku, cover_image_url, stock_quantity) VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id",
            (product.name, product.description, product.price_cents, product.category, product.brand, product.sku, product.cover_image_url, product.stock_quantity)
        )
        product_id = cur.fetchone()["id"]
        conn.commit()
        return {"id": product_id}

@router.get("/")
def get_products():
    with get_db_connection() as conn:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("SELECT * FROM products")
        products = cur.fetchall()
        return products


@router.get("/{product_id}")
def get_product(product_id: int):
    with get_db_connection() as conn:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            "SELECT * FROM products WHERE id = %s", (product_id,)
        )
        product = cur.fetchone()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product

@router.delete("/{product_id}")
def delete_product(product_id: int): 
    with get_db_connection() as conn:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("DELETE FROM products WHERE id = %s", (product_id,))
        conn.commit()
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Product not found")
        return {"message": "Product deleted successfully"}

@router.put("/{product_id}")
def update_product(product_id: int, product: ProductUpdate):
    with get_db_connection() as conn:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        updates = {k: v for k, v in product.dict().items() if v is not None}
        if not updates: 
            raise HTTPException(status_code = 400, detail="No fields to update")
        set_clause = ", ".join(f"{key} = %s" for key in updates.keys())
        values = list(updates.values()) + [product_id]
        cur.execute(
            f"UPDATE products SET {set_clause} WHERE id = %s", values
        )
        conn.commit()
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Product not found")
        return {"message": "Product updated successfully"}


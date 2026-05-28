'use client';

import { useState } from 'react';
//this is a practice file for me to practice my typescript skills

type Product = { 
    id: number;
    name: string;
    price: number;
    stock: number;
}

type CartItem = { 
    product: Product;
    quantity: number;
}

const products: Product[] = [
    {
        id: 1,
        name: 'Product 1',
        price: 100,
        stock: 10,
    },
    {
        id: 2,
        name: 'Product 2',
        price: 200,
        stock: 20,
    },
    {
        id: 3,
        name: 'Product 3',
        price: 300,
        stock: 30,
    },
]

const initialCart: CartItem[] = [
    {
        product: products[0],
        quantity: 1,
    },
    {
        product: products[1],
        quantity: 2,
    },
]

// Practice: typed fetch functions for getProduct(id), addToCart(), and getCart()
const API_BASE = 'http://localhost:8000';

async function getProduct(id: number): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) {
        throw new Error(`getProduct failed: ${res.status}`);
    }
    const data = await res.json();
    return {
        id: data.id,
        name: data.name,
        price: data.price_cents,
        stock: data.stock_quantity,
    };
}

async function addToCart(token: string, item: CartItem): Promise<CartItem> {
    const res = await fetch(`${API_BASE}/carts/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            product_id: item.product.id,
            quantity: item.quantity,
        }),
    });
    if (!res.ok) {
        throw new Error(`addToCart failed: ${res.status}`);
    }
    const data = await res.json();
    return {
        product: item.product,
        quantity: data.quantity,
    };
}

async function getCart(token: string): Promise<CartItem[]> {
    const res = await fetch(`${API_BASE}/carts/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        throw new Error(`getCart failed: ${res.status}`);
    }
    const rows = await res.json();
    return Promise.all(
        rows.map(async (row: { product_id: number; quantity: number }) => ({
            product: await getProduct(row.product_id),
            quantity: row.quantity,
        })),
    );
}

function ProductItemRow({product}: {product: Product}) { 
    return ( 
        <div> 
            <span>{'#' + product.id}</span>
            <span>{product.name}</span>
            <span>{product.price}</span>
            <span>{product.stock}</span>
        </div>
    )
}

function CartItemRow({item}: {item: CartItem}) { 
    return ( 
        <div> 
            <span>{item.product.name}</span>
            <span>{item.quantity}</span>
        </div>
    )
}

export default function PracticePage() { 
    const [cart, setCart] = useState<CartItem[]>(initialCart);

    return ( 
        <div> 
            <h1>Products</h1>
            <div> 
                {products.map((product) => (
                    <ProductItemRow key={product.id} product={product} />
                ))}
            </div>

            <h1>Cart</h1>
            <div> 
                {cart.map((item) => (
                    <CartItemRow key={item.product.id} item={item} />
                ))}
            </div>
        </div>
    )
}

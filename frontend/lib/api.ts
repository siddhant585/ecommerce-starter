//typed fetch functions for every backend endpoint

import { getToken } from './session';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

// --- Product (products table + Pydantic models) ---

export type Product = {
    id: number;
    name: string;
    description: string | null;
    price_cents: number;
    category: string;
    brand: string;
    sku: string;
    cover_image_url: string | null;
    stock_quantity: number;
    created_at: string;
    updated_at: string;
};
// --- CartItem (cart_items table + Pydantic models) ---

export type CartItem = {
    session_token: string;
    product_id: number;
    quantity: number;
};

export type CartItemCreate = {
    product_id: number;
    quantity: number;
};

export type CartItemUpdate = {
    quantity: number;
};

export type EnrichedCartItem = { 
    product: Product;
    quantity: number;
}

// --- Order (orders + order_items tables) ---
export type CheckoutResponse = {
    order_id: number;
};


//now all fetch functions

export async function getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/products/`);
    if (!res.ok) {
        throw new Error(`getProducts failed: ${res.status}`);
    }
    const data = await res.json();
    return data as Product[];
}

export async function getProduct(id: number): Promise<Product> { 
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) {
        throw new Error(`getProduct failed: ${res.status}`);
    }
    const data = await res.json();
    return data as Product;
}

export async function addToCart(product_id: number, quantity: number): Promise<void> {
    const res = await fetch(`${API_BASE}/carts/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
            product_id: product_id,
            quantity: quantity,
        }),
    });
    if (!res.ok) {
        throw new Error(`addToCart failed: ${res.status}`);
    }
}

export async function getCart(): Promise<EnrichedCartItem[]> {
    const res = await fetch(`${API_BASE}/carts/`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
    if (!res.ok) {
        throw new Error(`getCart failed: ${res.status}`);
    }
    const rows = await res.json() as CartItem[];
  return Promise.all(
      rows.map(async (row) => ({
          product: await getProduct(row.product_id),
          quantity: row.quantity,
      }))
  );

}

export async function updateCartItem(product_id: number, quantity: number): Promise<void> {
    const res = await fetch(`${API_BASE}/carts/${product_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ quantity }),
    });
    if (!res.ok) {
        throw new Error(`updateCartItem failed: ${res.status}`);
    }
}

export async function removeCartItem(product_id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/carts/${product_id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
    if (!res.ok) {
        throw new Error(`removeCartItem failed: ${res.status}`);
    }
}

export async function checkout(): Promise<CheckoutResponse> {
    const res = await fetch(`${API_BASE}/checkout/`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
    if (!res.ok) {
        throw new Error(`checkout failed: ${res.status}`);
    }
    const data = await res.json();
    return data as CheckoutResponse;
}
'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { getProducts, type Product } from '@/lib/api';

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getProducts()
            .then((data) => {
                setProducts(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to load products',
                );
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
                <p className="text-zinc-500">Loading products...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
                <p className="text-red-600">{error}</p>
            </main>
        );
    }

    return (
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
            <h1 className="mb-8 text-2xl font-semibold tracking-tight">
                Products
            </h1>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </main>
    );
}

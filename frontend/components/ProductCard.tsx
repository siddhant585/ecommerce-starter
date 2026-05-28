'use client';

import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/lib/api';

function formatPrice(cents: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(cents / 100);
}

export default function ProductCard({ product }: { product: Product }) {
    const { addItem } = useCart();
    const outOfStock = product.stock_quantity === 0;

    return (
        <article className="flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <div className="relative aspect-square bg-zinc-100 dark:bg-zinc-900">
                {product.cover_image_url?.startsWith('http') ? (
                    <Image
                        src={product.cover_image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-sm text-zinc-400">
                        No image
                    </div>
                )}
                {outOfStock && (
                    <span className="absolute left-2 top-2 rounded bg-zinc-900 px-2 py-1 text-xs font-medium text-white">
                        Out of stock
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                    <h2 className="font-medium text-foreground">{product.name}</h2>
                    <p className="mt-1 text-lg font-semibold text-foreground">
                        {formatPrice(product.price_cents)}
                    </p>
                </div>

                <button
                    type="button"
                    disabled={outOfStock}
                    onClick={() => addItem(product.id, 1)}
                    className="mt-auto rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Add to Cart
                </button>
            </div>
        </article>
    );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { checkout } from '@/lib/api';
import type { EnrichedCartItem } from '@/lib/api';

function formatPrice(cents: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(cents / 100);
}

function CartDrawerItem({
    item,
    onDecrease,
    onIncrease,
    onRemove,
}: {
    item: EnrichedCartItem;
    onDecrease: () => void;
    onIncrease: () => void;
    onRemove: () => void;
}) {
    return (
        <li className="flex gap-4 border-b border-zinc-200 py-4 dark:border-zinc-800">
            <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{item.product.name}</p>
                <p className="mt-1 text-sm text-zinc-500">
                    {formatPrice(item.product.price_cents)}
                </p>

                <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center rounded-md border border-zinc-200 dark:border-zinc-700">
                        <button
                            type="button"
                            onClick={onDecrease}
                            aria-label={`Decrease quantity of ${item.product.name}`}
                            className="px-2 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900"
                        >
                            −
                        </button>
                        <span className="min-w-8 px-2 text-center text-sm">
                            {item.quantity}
                        </span>
                        <button
                            type="button"
                            onClick={onIncrease}
                            aria-label={`Increase quantity of ${item.product.name}`}
                            className="px-2 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900"
                        >
                            +
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={onRemove}
                        className="text-sm text-red-600 hover:underline"
                    >
                        Remove
                    </button>
                </div>
            </div>

            <p className="shrink-0 font-medium">
                {formatPrice(item.product.price_cents * item.quantity)}
            </p>
        </li>
    );
}

export default function CartDrawer() {
    const router = useRouter();
    const { cart, isOpen, closeCart, updateItem, removeItem, refreshCart } =
        useCart();
    const [checkoutError, setCheckoutError] = useState<string | null>(null);
    const [checkingOut, setCheckingOut] = useState(false);

    const subtotal = cart.reduce(
        (sum, item) => sum + item.product.price_cents * item.quantity,
        0,
    );

    async function handleCheckout() {
        setCheckoutError(null);
        setCheckingOut(true);

        try {
            const { order_id } = await checkout();
            await refreshCart();
            closeCart();
            router.push(`/order/${order_id}`);
        } catch (err) {
            setCheckoutError(
                err instanceof Error ? err.message : 'Checkout failed',
            );
        } finally {
            setCheckingOut(false);
        }
    }

    return (
        <>
            <div
                className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
                    isOpen
                        ? 'opacity-100'
                        : 'pointer-events-none opacity-0'
                }`}
                onClick={closeCart}
                aria-hidden={!isOpen}
            />

            <aside
                className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-xl transition-transform duration-300 dark:bg-zinc-950 ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
                aria-hidden={!isOpen}
            >
                <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-4 dark:border-zinc-800">
                    <h2 className="text-lg font-semibold">Cart</h2>
                    <button
                        type="button"
                        onClick={closeCart}
                        aria-label="Close cart"
                        className="rounded-md p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4">
                    {cart.length === 0 ? (
                        <p className="py-8 text-center text-zinc-500">
                            Your cart is empty
                        </p>
                    ) : (
                        <ul>
                            {cart.map((item) => (
                                <CartDrawerItem
                                    key={item.product.id}
                                    item={item}
                                    onDecrease={() => {
                                        if (item.quantity <= 1) {
                                            removeItem(item.product.id);
                                        } else {
                                            updateItem(
                                                item.product.id,
                                                item.quantity - 1,
                                            );
                                        }
                                    }}
                                    onIncrease={() =>
                                        updateItem(
                                            item.product.id,
                                            item.quantity + 1,
                                        )
                                    }
                                    onRemove={() =>
                                        removeItem(item.product.id)
                                    }
                                />
                            ))}
                        </ul>
                    )}
                </div>

                <div className="border-t border-zinc-200 px-4 py-4 dark:border-zinc-800">
                    <div className="mb-4 flex items-center justify-between">
                        <span className="font-medium">Subtotal</span>
                        <span className="font-semibold">
                            {formatPrice(subtotal)}
                        </span>
                    </div>

                    {checkoutError && (
                        <p className="mb-3 text-sm text-red-600">
                            {checkoutError}
                        </p>
                    )}

                    <button
                        type="button"
                        disabled={cart.length === 0 || checkingOut}
                        onClick={handleCheckout}
                        className="w-full rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {checkingOut ? 'Checking out...' : 'Checkout'}
                    </button>
                </div>
            </aside>
        </>
    );
}

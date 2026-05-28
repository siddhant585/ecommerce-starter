'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
    const { cart, openCart } = useCart();
    const itemCount = cart.length;

    return (
        <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
            <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
                <Link
                    href="/"
                    className="text-lg font-semibold tracking-tight text-foreground"
                >
                    Shop
                </Link>

                <button
                    type="button"
                    onClick={openCart}
                    aria-label={`Open cart${itemCount > 0 ? `, ${itemCount} items` : ''}`}
                    className="relative rounded-md p-2 text-foreground transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="h-6 w-6"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                        />
                    </svg>

                    {itemCount > 0 && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-xs font-medium text-background">
                            {itemCount}
                        </span>
                    )}
                </button>
            </nav>
        </header>
    );
}

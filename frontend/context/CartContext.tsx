'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react';
import {
    addToCart,
    getCart,
    removeCartItem,
    updateCartItem,
    type EnrichedCartItem,
} from '@/lib/api';
import { initSession } from '@/lib/session';

export type CartContextValue = {
    cart: EnrichedCartItem[];
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    refreshCart: () => Promise<void>;
    addItem: (productId: number, quantity: number) => Promise<void>;
    updateItem: (productId: number, quantity: number) => Promise<void>;
    removeItem: (productId: number) => Promise<void>;
};

export const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<EnrichedCartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const refreshCart = useCallback(async () => {
        const items = await getCart();
        setCart(items);
    }, []);

    const openCart = useCallback(() => setIsOpen(true), []);
    const closeCart = useCallback(() => setIsOpen(false), []);

    const addItem = useCallback(
        async (productId: number, quantity: number) => {
            await addToCart(productId, quantity);
            await refreshCart();
        },
        [refreshCart],
    );

    const updateItem = useCallback(
        async (productId: number, quantity: number) => {
            await updateCartItem(productId, quantity);
            await refreshCart();
        },
        [refreshCart],
    );

    const removeItem = useCallback(
        async (productId: number) => {
            await removeCartItem(productId);
            await refreshCart();
        },
        [refreshCart],
    );

    useEffect(() => {
        initSession().then(refreshCart);
    }, [refreshCart]);

    return (
        <CartContext.Provider
            value={{
                cart,
                isOpen,
                openCart,
                closeCart,
                refreshCart,
                addItem,
                updateItem,
                removeItem,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart(): CartContextValue {
    const ctx = useContext(CartContext);
    if (!ctx) {
        throw new Error('useCart must be used within CartProvider');
    }
    return ctx;
}

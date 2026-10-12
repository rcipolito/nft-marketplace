import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import type { CartItem } from "@/types/cart";

type CartContextType = {
    items: CartItem[];
    addItem: (nftId: string) => void;
    removeItem: (nftId: string) => void;
    isInCart: (nftId: string) => boolean;
    clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "nft-cart";

function loadCart(): CartItem[] {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) return [];

        const parsed: unknown = JSON.parse(saved);

        if (
            Array.isArray(parsed) &&
            parsed.every(
                (item) =>
                    typeof item === "object" &&
                    item !== null &&
                    typeof item.nftId === "string" &&
                    item.quantity === 1
            )
        ) {
            return parsed;
        }

        return [];
    } catch {
        return [];
    }
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(loadCart);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    function addItem(nftId: string) {
        setItems((previous) => {
            if (previous.some((item) => item.nftId === nftId)) {
                return previous;
            }

            return [...previous, { nftId, quantity: 1 }];
        });
    }

    function removeItem(nftId: string) {
        setItems((previous) =>
            previous.filter((item) => item.nftId !== nftId)
        );
    }

    function isInCart(nftId: string) {
        return items.some((item) => item.nftId === nftId);
    }

    function clearCart() {
        setItems([]);
    }

    return (
        <CartContext.Provider
            value={{ items, addItem, removeItem, isInCart, clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart deve ser usado dentro de CartProvider");
    }

    return context;
}
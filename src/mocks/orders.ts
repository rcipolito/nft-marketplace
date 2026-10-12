import type { Order } from "@/types/order";

const STORAGE_KEY = "nft-mock-orders";

export function loadOrders(): Order[] {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
}

export function saveOrders(orders: Order[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}
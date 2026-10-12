import type { Wallet } from "@/types/wallet";

const STORAGE_KEY = "nft-mock-wallets";

export function loadWallets(): Wallet[] {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) return [];

        const parsed: unknown = JSON.parse(saved);

        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function saveWallets(wallets: Wallet[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wallets));
}
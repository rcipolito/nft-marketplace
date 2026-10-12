import type { LoginResponse } from "@/types/auth";

export function getValidSession(): LoginResponse | null {
    try {
        const saved = localStorage.getItem("nft-session");

        if (!saved) return null;

        const session = JSON.parse(saved) as LoginResponse;

        if (
            !session.token ||
            !session.user?.id ||
            !Number.isFinite(session.expiresAt) ||
            session.expiresAt <= Date.now()
        ) {
            localStorage.removeItem("nft-session");
            return null;
        }

        return session;
    } catch {
        localStorage.removeItem("nft-session");
        return null;
    }
}
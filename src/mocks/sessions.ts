import type { LoginResponse } from "@/types/auth";

const STORAGE_KEY = "nft-mock-sessions";

export function loadSessions(): LoginResponse[] {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) return [];

        const parsed: unknown = JSON.parse(saved);

        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function saveSessions(sessions: LoginResponse[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function findSession(token: string) {
    return loadSessions().find(
        (session) =>
            session.token === token &&
            session.expiresAt > Date.now()
    );
}

export function revokeSession(token: string) {
    saveSessions(
        loadSessions().filter((session) => session.token !== token)
    );
}
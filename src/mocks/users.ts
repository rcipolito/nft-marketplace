import type { User } from "@/types/auth";

export type MockUser = User & {
    password: string;
};

const STORAGE_KEY = "nft-mock-users";

const defaultUsers: MockUser[] = [
    {
        id: "1",
        name: "Usuário Teste",
        email: "teste@nft.com",
        password: "123456",
    },
];

export function loadUsers(): MockUser[] {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) return defaultUsers;

        const parsed: unknown = JSON.parse(saved);

        return Array.isArray(parsed) ? parsed : defaultUsers;
    } catch {
        return defaultUsers;
    }
}

export function saveUsers(users: MockUser[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}
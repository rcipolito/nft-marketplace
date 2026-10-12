import { http, HttpResponse } from "msw";
import { loadUsers, saveUsers } from "./users";
import {
    loadSessions,
    saveSessions,
    findSession,
    revokeSession,
} from "./sessions";

import type {
    LoginInput,
    LoginResponse,
    RegisterInput,
    User,
} from "@/types/auth";

function createSession(user: User): LoginResponse {
    const session: LoginResponse = {
        user,
        token: crypto.randomUUID(),
        expiresAt: Date.now() + 60 * 60 * 1000,
    };

    saveSessions([...loadSessions(), session]);

    return session;
}

export const authHandlers = [
    http.post("/api/auth/login", async ({ request }) => {
        const input = (await request.json()) as LoginInput;

        const user = loadUsers().find(
            (item) =>
                item.email === input.email.trim().toLowerCase() &&
                item.password === input.password
        );

        if (!user) {
            return HttpResponse.json(
                { message: "E-mail ou senha inválidos" },
                { status: 401 }
            );
        }

        return HttpResponse.json(
            createSession({
                id: user.id,
                name: user.name,
                email: user.email,
            })
        );
    }),

    http.post("/api/auth/register", async ({ request }) => {
        const input = (await request.json()) as RegisterInput;

        const name = input.name?.trim();
        const email = input.email?.trim().toLowerCase();
        const password = input.password;

        if (
            !name ||
            !email ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
            typeof password !== "string" ||
            password.length < 6
        ) {
            return HttpResponse.json(
                { message: "Dados de cadastro inválidos" },
                { status: 400 }
            );
        }

        const users = loadUsers();

        if (users.some((user) => user.email === email)) {
            return HttpResponse.json(
                { message: "Este e-mail já está cadastrado" },
                { status: 409 }
            );
        }

        const user = {
            id: crypto.randomUUID(),
            name,
            email,
            password,
        };

        saveUsers([...users, user]);

        return HttpResponse.json(
            createSession({
                id: user.id,
                name: user.name,
                email: user.email,
            }),
            { status: 201 }
        );
    }),

    http.get("/api/auth/me", ({ request }) => {
        const token = request.headers
            .get("Authorization")
            ?.replace("Bearer ", "");

        const session = token ? findSession(token) : null;

        if (!session) {
            return HttpResponse.json(
                { message: "Sessão inválida ou expirada" },
                { status: 401 }
            );
        }

        return HttpResponse.json(session.user);
    }),

    http.post("/api/auth/logout", ({ request }) => {
        const token = request.headers
            .get("Authorization")
            ?.replace("Bearer ", "");

        if (token) {
            revokeSession(token);
        }

        return new HttpResponse(null, { status: 204 });
    }),
];
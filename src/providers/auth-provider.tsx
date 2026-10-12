import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { router } from "@/routes/router";
import { logout } from "@/services/auth";

import type { LoginResponse, User } from "@/types/auth";

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    signIn: (session: LoginResponse) => void;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

const STORAGE_KEY = "nft-session";

function loadSession(): LoginResponse | null {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) return null;

        const session = JSON.parse(saved) as LoginResponse;

        if (session.expiresAt <= Date.now()) {
            localStorage.removeItem(STORAGE_KEY);
            return null;
        }

        return session;
    } catch {
        return null;
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient();

    const [session, setSession] = useState<LoginResponse | null>(
        loadSession
    );

    const activeSession =
        session && session.expiresAt > Date.now()
            ? session
            : null;

    function signIn(newSession: LoginResponse) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
        setSession(newSession);
    }

    async function signOut() {
        try {
            await logout();
        } catch {
            // Mesmo se a requisição falhar, encerramos a sessão local.
        }

        localStorage.removeItem(STORAGE_KEY);
        setSession(null);

        queryClient.clear();

        await router.invalidate();
        await router.navigate({ to: "/login" });
    }

    useEffect(() => {
        if (!session) return;

        const remainingTime = session.expiresAt - Date.now();

        if (remainingTime <= 0) {
            void signOut();
            return;
        }

        const timeout = window.setTimeout(() => {
            void signOut();
        }, remainingTime);

        return () => window.clearTimeout(timeout);
    }, [session]);

    return (
        <AuthContext.Provider
            value={{
                user: activeSession?.user ?? null,
                isAuthenticated: Boolean(activeSession),
                signIn,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth deve ser usado dentro de AuthProvider");
    }

    return context;
}
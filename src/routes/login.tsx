import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { login } from "@/services/auth";
import { useAuth } from "@/providers/auth-provider";

export default function Login() {
    const navigate = useNavigate();
    const { signIn } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const mutation = useMutation({
        mutationFn: login,
        onSuccess: (session) => {
            signIn(session);
            navigate({ to: "/" });
        },
    });

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        mutation.mutate({
            email,
            password,
        });
    }

    return (
        <main className="mx-auto max-w-md p-8">
            <h1 className="mb-8 text-3xl font-bold">Entrar</h1>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="email" className="mb-2 block">
                        E-mail
                    </label>

                    <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="password" className="mb-2 block">
                        Senha
                    </label>

                    <Input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>

                {mutation.isError && (
                    <p role="alert" className="text-sm text-red-500">
                        E-mail ou senha inválidos.
                    </p>
                )}

                <Button
                    type="submit"
                    className="w-full"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? "Entrando..." : "Entrar"}
                </Button>
                <p className="mt-6 text-sm">
                    Ainda não possui conta?{" "}
                    <Link to="/register" className="underline">
                        Criar conta
                    </Link>
                </p>
            </form>
        </main>
    );
}
import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { register } from "@/services/auth";
import { useAuth } from "@/providers/auth-provider";

export default function Register() {
    const navigate = useNavigate();
    const { signIn } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const mutation = useMutation({
        mutationFn: register,
        onSuccess: (session) => {
            signIn(session);
            navigate({ to: "/profile" });
        },
    });

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        mutation.mutate({ name, email, password });
    }

    const errorMessage = axios.isAxiosError(mutation.error)
        ? mutation.error.response?.data?.message
        : null;

    return (
        <main className="mx-auto max-w-md p-8">
            <h1 className="mb-8 text-3xl font-bold">
                Criar conta
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="name" className="mb-2 block">
                        Nome
                    </label>

                    <Input
                        id="name"
                        required
                        autoComplete="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="email" className="mb-2 block">
                        E-mail
                    </label>

                    <Input
                        id="email"
                        type="email"
                        required
                        autoComplete="email"
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
                        required
                        minLength={6}
                        autoComplete="new-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />

                    <p className="mt-1 text-sm text-zinc-500">
                        Mínimo de 6 caracteres.
                    </p>
                </div>

                {mutation.isError && (
                    <p role="alert" className="text-sm text-red-500">
                        {errorMessage || "Não foi possível criar a conta."}
                    </p>
                )}

                <Button
                    type="submit"
                    className="w-full"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending
                        ? "Criando conta..."
                        : "Criar conta"}
                </Button>
            </form>

            <p className="mt-6 text-sm">
                Já possui uma conta?{" "}
                <Link to="/login" className="underline">
                    Entrar
                </Link>
            </p>
        </main>
    );
}
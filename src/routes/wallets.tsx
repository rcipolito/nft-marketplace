import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useAuth } from "@/providers/auth-provider";
import {
    buscarCarteiras,
    adicionarCarteira,
} from "@/services/wallets";

export default function Wallets() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");

    const { data: wallets = [], isPending, isError } = useQuery({
        queryKey: ["wallets", user?.id],
        queryFn: buscarCarteiras,
        enabled: Boolean(user),
    });

    const mutation = useMutation({
        mutationFn: adicionarCarteira,
        onSuccess: () => {
            setName("");
            setAddress("");

            queryClient.invalidateQueries({
                queryKey: ["wallets", user?.id],
            });
        },
    });

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        mutation.mutate({ name, address });
    }

    return (
        <main className="mx-auto max-w-5xl p-8">
            <h1 className="mb-8 text-3xl font-bold">
                Minhas carteiras
            </h1>

            <form
                onSubmit={handleSubmit}
                className="mb-10 max-w-lg space-y-4"
            >
                <div>
                    <label htmlFor="wallet-name" className="mb-2 block">
                        Nome da carteira
                    </label>

                    <Input
                        id="wallet-name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Minha carteira"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="wallet-address" className="mb-2 block">
                        Endereço Ethereum
                    </label>

                    <Input
                        id="wallet-address"
                        value={address}
                        onChange={(event) => setAddress(event.target.value)}
                        placeholder="0x..."
                        required
                    />
                </div>

                {mutation.isError && (
                    <p role="alert" className="text-sm text-red-500">
                        Não foi possível adicionar a carteira.
                        Verifique o endereço informado.
                    </p>
                )}

                <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending
                        ? "Adicionando..."
                        : "Adicionar carteira"}
                </Button>
            </form>

            {isPending && <p>Carregando carteiras...</p>}

            {isError && (
                <p role="alert">Erro ao carregar carteiras.</p>
            )}

            {!isPending && !isError && wallets.length === 0 && (
                <p className="text-zinc-500">
                    Você ainda não possui carteiras cadastradas.
                </p>
            )}

            <div className="space-y-4">
                {wallets.map((wallet) => (
                    <div key={wallet.id} className="rounded-xl border p-5">
                        <h2 className="font-semibold">{wallet.name}</h2>

                        <p className="mt-2 break-all text-sm text-zinc-500">
                            {wallet.address}
                        </p>

                        <p className="mt-3">
                            Saldo: {wallet.balanceEth} ETH
                        </p>
                    </div>
                ))}
            </div>
        </main>
    );
}
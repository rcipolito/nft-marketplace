import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { useCart } from "@/providers/cart-provider";
import { buscarNftsPorIds } from "@/services/nfts";
import { ethToWei, weiToEth } from "@/utils/eth";
import { useNavigate } from "@tanstack/react-router";

export default function Cart() {
    const { items, removeItem } = useCart();

    const ids = items.map((item) => item.nftId);

    const { data, isPending, isError, refetch } = useQuery({
        queryKey: ["cart-nfts", ids],
        queryFn: () => buscarNftsPorIds(ids),
        enabled: ids.length > 0,
    });

    const navigate = useNavigate();

    if (items.length === 0) {
        return (
            <main className="mx-auto max-w-5xl p-8">
                <h1 className="mb-6 text-3xl font-bold">Meu carrinho</h1>
                <p>Seu carrinho está vazio.</p>

                <Link to="/" className="mt-4 inline-block underline">
                    Explorar NFTs
                </Link>
            </main>
        );
    }

    if (isPending) {
        return <p className="p-8">Carregando carrinho...</p>;
    }

    if (isError) {
        return (
            <div className="p-8">
                <p>Não foi possível carregar o carrinho.</p>
                <Button onClick={() => refetch()} className="mt-4">
                    Tentar novamente
                </Button>
            </div>
        );
    }

    const cartNfts = data ?? [];

    const hasMissingNfts = cartNfts.length !== items.length;

    const totalWei = cartNfts.reduce(
        (total, nft) => total + ethToWei(nft.priceEth),
        0n
    );

    return (
        <main className="mx-auto max-w-5xl p-8">
            <h1 className="mb-8 text-3xl font-bold">Meu carrinho</h1>

            <div className="space-y-6">
                {cartNfts.map((nft) => (
                    <div
                        key={nft.id}
                        className="flex items-center gap-6 rounded-xl border border-zinc-800 p-4"
                    >
                        <img
                            src={nft.image}
                            alt={nft.name}
                            className="h-24 w-24 rounded-lg object-cover"
                        />

                        <div className="flex-1">
                            <Link
                                to="/nft/$nftId"
                                params={{ nftId: nft.id }}
                                className="font-semibold hover:underline"
                            >
                                {nft.name}
                            </Link>

                            <p className="text-sm text-zinc-500">
                                {nft.creator}
                            </p>

                            <p className="mt-2 font-bold">
                                {nft.priceEth} ETH
                            </p>
                        </div>

                        <Button
                            variant="outline"
                            onClick={() => removeItem(nft.id)}
                        >
                            Remover
                        </Button>
                    </div>
                ))}
            </div>

            <div className="mt-8 border-t border-zinc-800 pt-6">
                <div className="flex items-center justify-between">
                    <span className="text-xl font-semibold">Total</span>

                    <span className="text-2xl font-bold">
                        {weiToEth(totalWei)} ETH
                    </span>
                </div>

                <Button
                    className="mt-6 w-full"
                    disabled={hasMissingNfts}
                    onClick={() => navigate({ to: "/checkout" })}
                >
                    Finalizar compra
                </Button>

                {hasMissingNfts && (
                    <p role="alert" className="mt-3 text-sm text-red-500">
                        Alguns NFTs do carrinho não estão disponíveis.
                        Remova os itens indisponíveis antes de continuar.
                    </p>
                )}
            </div>
        </main>
    );
}
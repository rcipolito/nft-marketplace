import axios from "axios";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useCart } from "@/providers/cart-provider";
import { buscarNftsPorIds } from "@/services/nfts";
import { criarPedido } from "@/services/orders";
import { ethToWei, weiToEth } from "@/utils/eth";
import { registerOrderEvent } from "@/services/order-events";
import { useAuth } from "@/providers/auth-provider";

export default function Checkout() {
    const { user } = useAuth();
    const { items, clearCart } = useCart();
    const navigate = useNavigate();

    const [coupon, setCoupon] = useState("");
    const [idempotencyKey, setIdempotencyKey] = useState(
        () => crypto.randomUUID()
    );
    const [orderAccessToken] = useState(() => crypto.randomUUID());

    const ids = items.map((item) => item.nftId);

    const { data: nfts, isPending, isError } = useQuery({
        queryKey: ["checkout-nfts", ids],
        queryFn: () => buscarNftsPorIds(ids),
        enabled: ids.length > 0,
    });

    const mutation = useMutation({
        mutationFn: criarPedido,

        onSuccess: async (order) => {
            try {
                await registerOrderEvent(order.id, orderAccessToken);
            } catch (error) {
                console.warn("Eventos em tempo real indisponíveis", error);
            }

            sessionStorage.setItem(
                `order-access:${order.id}`,
                orderAccessToken
            );

            clearCart();

            navigate({
                to: "/order/$orderId",
                params: { orderId: order.id },
            });
        },
    });

    if (items.length === 0) {
        return (
            <main className="mx-auto max-w-5xl p-8">
                <h1 className="mb-4 text-3xl font-bold">Checkout</h1>
                <p>Seu carrinho está vazio.</p>
                <Link to="/cart" className="mt-4 inline-block underline">
                    Voltar ao carrinho
                </Link>
            </main>
        );
    }

    if (isPending) {
        return <p className="p-8">Carregando resumo...</p>;
    }

    if (isError || !nfts) {
        return <p className="p-8">Erro ao carregar o checkout.</p>;
    }

    const hasMissingNfts = nfts.length !== items.length;

    const subtotalWei = nfts.reduce(
        (total, nft) => total + ethToWei(nft.priceEth),
        0n
    );

    const normalizedCoupon = coupon.trim().toUpperCase();
    const couponIsValid = normalizedCoupon === "NFT10";

    const discountWei = couponIsValid ? subtotalWei / 10n : 0n;
    const totalWei = subtotalWei - discountWei;

    function handleCheckout() {
        if (hasMissingNfts || mutation.isPending) return;

        mutation.mutate({
            nftIds: ids,
            coupon: normalizedCoupon,
            idempotencyKey,
        });
    }

    return (
        <main className="mx-auto max-w-3xl p-8">
            <h1 className="mb-8 text-3xl font-bold">
                Finalizar compra
            </h1>

            <div className="space-y-4">
                {nfts.map((nft) => (
                    <div
                        key={nft.id}
                        className="flex justify-between border-b border-zinc-800 pb-4"
                    >
                        <span>{nft.name}</span>
                        <span>{nft.priceEth} ETH</span>
                    </div>
                ))}
            </div>

            <div className="mt-8">
                <label htmlFor="coupon" className="mb-2 block">
                    Cupom de desconto
                </label>

                <Input
                    id="coupon"
                    value={coupon}
                    onChange={(event) => setCoupon(event.target.value)}
                    placeholder="Digite seu cupom"
                />

                <p className="mt-2 text-sm text-zinc-500">
                    Para testar, utilize NFT10 (10% de desconto).
                </p>
            </div>

            <div className="mt-8 space-y-3 border-t border-zinc-800 pt-6">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{weiToEth(subtotalWei)} ETH</span>
                </div>

                <div className="flex justify-between">
                    <span>Desconto</span>
                    <span>- {weiToEth(discountWei)} ETH</span>
                </div>

                <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>{weiToEth(totalWei)} ETH</span>
                </div>
            </div>

            {hasMissingNfts && (
                <p role="alert" className="mt-4 text-red-500">
                    Alguns NFTs não estão disponíveis. Revise o carrinho.
                </p>
            )}

            {mutation.isError && (
                <p role="alert" className="mt-4 text-red-500">
                    {axios.isAxiosError(mutation.error)
                        ? mutation.error.response?.data?.message ||
                        mutation.error.message
                        : "Não foi possível confirmar o pedido."}
                </p>
            )}

            <Button
                className="mt-8 w-full"
                disabled={hasMissingNfts || mutation.isPending}
                onClick={handleCheckout}
            >
                {mutation.isPending ? "Confirmando..." : "Confirmar compra"}
            </Button>
        </main>
    );
}
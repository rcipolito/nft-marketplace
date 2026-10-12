import { http, HttpResponse } from "msw";

import { nfts } from "./data";
import { loadOrders, saveOrders } from "./orders";
import { ethToWei, weiToEth } from "@/utils/eth";
import { loadCurrentPrices } from "./prices";

import type { CreateOrderInput, Order } from "@/types/order";

export const orderHandlers = [
    http.post("/api/orders", async ({ request }) => {
        const input = (await request.json()) as CreateOrderInput;

        const orders = loadOrders();

        // Evita criar um segundo pedido com a mesma chave
        const existingOrder = orders.find(
            (order) => order.id === input.idempotencyKey
        );

        if (existingOrder) {
            return HttpResponse.json(existingOrder);
        }

        if (
            !Array.isArray(input.nftIds) ||
            input.nftIds.length === 0 ||
            new Set(input.nftIds).size !== input.nftIds.length ||
            typeof input.idempotencyKey !== "string" ||
            !input.idempotencyKey
        ) {
            return HttpResponse.json(
                { message: "Pedido inválido" },
                { status: 400 }
            );
        }

        const selectedNfts = input.nftIds.map((id) =>
            nfts.find((nft) => nft.id === id)
        );

        if (selectedNfts.some((nft) => !nft)) {
            return HttpResponse.json(
                { message: "Um ou mais NFTs não estão disponíveis" },
                { status: 409 }
            );
        }

        let prices;

        try {
            prices = await loadCurrentPrices();
        } catch {
            return HttpResponse.json(
                { message: "Não foi possível validar os preços" },
                { status: 503 }
            );
        }

        const validNfts = selectedNfts
            .filter((nft) => nft !== undefined)
            .map((nft) => ({
                ...nft,
                priceEth: prices[nft.id]?.priceEth ?? nft.priceEth,
            }));

        // O total é calculado novamente usando os dados da API simulada
        const subtotalWei = validNfts.reduce(
            (total, nft) => total + ethToWei(nft.priceEth),
            0n
        );

        // Cupom de exemplo: NFT10 = 10% de desconto
        const coupon = (input.coupon ?? "").trim().toUpperCase();

        if (coupon && coupon !== "NFT10") {
            return HttpResponse.json(
                { message: "Cupom inválido" },
                { status: 400 }
            );
        }

        const discountWei =
            coupon === "NFT10" ? subtotalWei / 10n : 0n;

        const totalWei = subtotalWei - discountWei;

        const order: Order = {
            id: input.idempotencyKey,
            items: validNfts.map((nft) => ({
                nftId: nft.id,
                name: nft.name,
                priceEth: nft.priceEth,
            })),
            subtotalEth: weiToEth(subtotalWei),
            discountEth: weiToEth(discountWei),
            totalEth: weiToEth(totalWei),
            coupon: coupon || null,
            status: "pending",
            createdAt: new Date().toISOString(),
        };

        saveOrders([...orders, order]);

        return HttpResponse.json(order, { status: 201 });
    }),

    http.get("/api/orders/:id", ({ params }) => {
        const order = loadOrders().find(
            (item) => item.id === params.id
        );

        if (!order) {
            return HttpResponse.json(
                { message: "Pedido não encontrado" },
                { status: 404 }
            );
        }

        return HttpResponse.json(order);
    }),
];
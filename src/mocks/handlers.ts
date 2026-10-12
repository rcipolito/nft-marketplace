import { http, HttpResponse } from "msw";
import { nfts } from "./data";
import { loadCurrentPrices } from "./prices";

export const handlers = [
    http.get("/api/cart/nfts", async ({ request }) => {
        const url = new URL(request.url);

        const prices = await loadCurrentPrices();

        const currentNfts = nfts.map((nft) => ({
            ...nft,
            priceEth: prices[nft.id]?.priceEth ?? nft.priceEth,
        }));

        const ids = (url.searchParams.get("ids") ?? "")
            .split(",")
            .filter(Boolean);

        const cartNfts = ids
            .map((id) => currentNfts.find((nft) => nft.id === id))
            .filter((nft) => nft !== undefined);

        return HttpResponse.json(cartNfts);
    }),
    http.get("/api/nfts", async ({ request }) => {
        const url = new URL(request.url);

        const search = (url.searchParams.get("search") ?? "").toLowerCase();
        const sort = url.searchParams.get("sort") ?? "recent";
        const page = Math.max(1, Number(url.searchParams.get("page")) || 1);

        const pageSize = 9;

        let prices;

        try {
            prices = await loadCurrentPrices();
        } catch {
            return HttpResponse.json(
                { message: "Serviço de preços indisponível" },
                { status: 503 }
            );
        }

        const currentNfts = nfts.map((nft) => ({
            ...nft,
            priceEth: prices[nft.id]?.priceEth ?? nft.priceEth,
        }));

        let result = currentNfts.filter((nft) =>
            nft.name.toLowerCase().includes(search)
        );

        if (sort === "price_asc") {
            result.sort(
                (a, b) => Number(a.priceEth) - Number(b.priceEth)
            );
        }

        if (sort === "price_desc") {
            result.sort(
                (a, b) => Number(b.priceEth) - Number(a.priceEth)
            );
        }

        const maxPriceParam = url.searchParams.get("maxPrice");

        if (maxPriceParam !== null) {
            const maxPrice = Number(maxPriceParam);

            if (!Number.isFinite(maxPrice) || maxPrice < 0) {
                return HttpResponse.json(
                    { message: "Preço máximo inválido" },
                    { status: 400 }
                );
            }

            result = result.filter(
                (nft) => Number(nft.priceEth) <= maxPrice
            );
        }

        if (maxPriceParam !== null) {
            const maxPrice = Number(maxPriceParam);

            if (!Number.isFinite(maxPrice) || maxPrice < 0) {
                return HttpResponse.json(
                    { message: "Preço máximo inválido" },
                    { status: 400 }
                );
            }

            result = result.filter(
                (nft) => Number(nft.priceEth) <= maxPrice
            );
        }

        const total = result.length;
        const totalPages = Math.ceil(total / pageSize);

        const start = (page - 1) * pageSize;

        return HttpResponse.json({
            items: result.slice(start, start + pageSize),
            total,
            totalPages,
        });
    }),
    http.get("/api/nfts/:id", async ({ params }) => {
        const nft = nfts.find((item) => item.id === params.id);

        if (!nft) {
            return HttpResponse.json(
                { message: "NFT não encontrado" },
                { status: 404 }
            );
        }

        try {
            const prices = await loadCurrentPrices();

            return HttpResponse.json({
                ...nft,
                priceEth: prices[nft.id]?.priceEth ?? nft.priceEth,
            });
        } catch {
            return HttpResponse.json(
                { message: "Serviço de preços indisponível" },
                { status: 503 }
            );
        }
    }),
];
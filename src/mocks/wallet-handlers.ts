import { http, HttpResponse } from "msw";

import { findSession } from "./sessions";
import { loadWallets, saveWallets } from "./wallets";

import type { Wallet } from "@/types/wallet";

function getAuthenticatedUser(request: Request) {
    const token = request.headers
        .get("Authorization")
        ?.replace("Bearer ", "");

    return token ? findSession(token)?.user : null;
}

export const walletHandlers = [
    http.get("/api/wallets", ({ request }) => {
        const user = getAuthenticatedUser(request);

        if (!user) {
            return HttpResponse.json(
                { message: "Não autorizado" },
                { status: 401 }
            );
        }

        const wallets = loadWallets().filter(
            (wallet) => wallet.userId === user.id
        );

        return HttpResponse.json(wallets);
    }),

    http.post("/api/wallets", async ({ request }) => {
        const user = getAuthenticatedUser(request);

        if (!user) {
            return HttpResponse.json(
                { message: "Não autorizado" },
                { status: 401 }
            );
        }

        const input = (await request.json()) as {
            name: string;
            address: string;
        };

        const name = input.name?.trim();
        const address = input.address?.trim();

        if (
            !name ||
            !address ||
            !/^0x[a-fA-F0-9]{40}$/.test(address)
        ) {
            return HttpResponse.json(
                { message: "Nome ou endereço inválido" },
                { status: 400 }
            );
        }

        const wallet: Wallet = {
            id: crypto.randomUUID(),
            userId: user.id,
            name,
            address,
            balanceEth: "0",
        };

        saveWallets([...loadWallets(), wallet]);

        return HttpResponse.json(wallet, { status: 201 });
    }),
];
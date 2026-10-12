import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { socket } from "@/services/socket";
import type { NftUpdatedEvent } from "@/types/socket";
import type { Nft } from "@/types/nft";

type NftListResponse = {
    items: Nft[];
    total: number;
    totalPages: number;
};

export function useNftSocket() {
    const queryClient = useQueryClient();

    useEffect(() => {
        const versions = new Map<string, number>();

        function handleNftUpdated(event: NftUpdatedEvent) {
            if (
                typeof event.id !== "string" ||
                typeof event.priceEth !== "string" ||
                !Number.isSafeInteger(event.version)
            ) {
                return;
            }

            const lastVersion = versions.get(event.id) ?? 0;

            // Ignora eventos repetidos ou antigos
            if (event.version <= lastVersion) return;

            versions.set(event.id, event.version);

            // Atualiza o NFT individual
            queryClient.setQueryData<Nft>(
                ["nft", event.id],
                (previous) =>
                    previous
                        ? { ...previous, priceEth: event.priceEth }
                        : previous
            );

            // Atualiza listas do catálogo
            queryClient.setQueriesData<NftListResponse>(
                { queryKey: ["nfts"] },
                (previous) =>
                    previous
                        ? {
                            ...previous,
                            items: previous.items.map((nft) =>
                                nft.id === event.id
                                    ? { ...nft, priceEth: event.priceEth }
                                    : nft
                            ),
                        }
                        : previous
            );

            // Atualiza a consulta específica do carrinho
            queryClient.setQueriesData<Nft[]>(
                { queryKey: ["cart-nfts"] },
                (previous) =>
                    previous?.map((nft) =>
                        nft.id === event.id
                            ? { ...nft, priceEth: event.priceEth }
                            : nft
                    )
            );

            // Atualiza o resumo do checkout
            queryClient.setQueriesData<Nft[]>(
                { queryKey: ["checkout-nfts"] },
                (previous) =>
                    previous?.map((nft) =>
                        nft.id === event.id
                            ? { ...nft, priceEth: event.priceEth }
                            : nft
                    )
            );
        }

        function handleReconnect() {
            // Revalida os dados caso alguma atualização
            // tenha ocorrido durante a desconexão
            queryClient.invalidateQueries({
                queryKey: ["nfts"],
            });

            queryClient.invalidateQueries({
                queryKey: ["cart-nfts"],
            });

            queryClient.invalidateQueries({
                queryKey: ["checkout-nfts"],
            });

            queryClient.invalidateQueries({
                queryKey: ["nft"],
            });
        }

        socket.on("nft.updated", handleNftUpdated);
        socket.on("connect", handleReconnect);

        socket.connect();

        return () => {
            socket.off("nft.updated", handleNftUpdated);
            socket.off("connect", handleReconnect);
            socket.disconnect();
        };
    }, [queryClient]);
}
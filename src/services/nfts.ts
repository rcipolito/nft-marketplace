import axios from "axios";
import type { Nft } from "@/types/nft";

export type NftFilters = {
    search: string;
    sort: "recent" | "price_asc" | "price_desc";
    page: number;
    maxPrice?: number;
}

export type NftResponse = {
    items: Nft[];
    total: number;
    totalPages: number;
}

export async function buscarNfts( filters: NftFilters ): Promise<NftResponse> {
    const response = await axios.get<NftResponse>("/api/nfts", {
        params: filters,
    });

    return response.data;
}

export async function buscarNftPorId(id: string): Promise<Nft> {
    const response = await axios.get<Nft>(`/api/nfts/${id}`);

    return response.data;
}

export async function buscarNftsPorIds(ids: string[]): Promise<Nft[]> {
    const response = await axios.get<Nft[]>("/api/cart/nfts", {
        params: {
            ids: ids.join(","),
        },
    });

    return response.data;
}
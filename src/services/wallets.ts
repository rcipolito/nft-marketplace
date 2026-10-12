import { api } from "./api";
import type { Wallet } from "@/types/wallet";

export async function buscarCarteiras(): Promise<Wallet[]> {
    const response = await api.get<Wallet[]>("/wallets");
    return response.data;
}

export async function adicionarCarteira(input: {
    name: string;
    address: string;
}): Promise<Wallet> {
    const response = await api.post<Wallet>("/wallets", input);
    return response.data;
}
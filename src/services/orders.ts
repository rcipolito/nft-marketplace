import axios from "axios";
import type { CreateOrderInput, Order } from "@/types/order";

export async function criarPedido(
    input: CreateOrderInput
): Promise<Order> {
    const response = await axios.post<Order>("/api/orders", input);

    return response.data;
}

export async function buscarPedido(id: string): Promise<Order> {
    const response = await axios.get<Order>(`/api/orders/${id}`);

    return response.data;
}
import { socket } from "./socket";

export function registerOrderEvent(
    orderId: string,
    accessToken: string
): Promise<void> {
    return new Promise((resolve, reject) => {
        socket.timeout(5000).emit(
            "order.register",
            { orderId, accessToken },
            (
                error: Error | null,
                result: { ok: boolean }
            ) => {
                if (error || !result?.ok) {
                    reject(new Error("Falha ao registrar evento do pedido"));
                    return;
                }

                resolve();
            }
        );
    });
}
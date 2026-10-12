import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { socket } from "@/services/socket";
import type { Order } from "@/types/order";

type OrderUpdatedEvent = {
    id: string;
    status: Order["status"];
    version: number;
};

export function useOrderSocket(orderId: string) {
    const queryClient = useQueryClient();

    useEffect(() => {
        let lastVersion = 0;

        const accessToken = sessionStorage.getItem(
            `order-access:${orderId}`
        );

        if (!accessToken) return;

        function subscribe() {
            socket.emit("order.subscribe", {
                orderId,
                accessToken,
            });
        }

        function handleOrderUpdated(event: OrderUpdatedEvent) {
            if (event.id !== orderId) return;

            if (!Number.isSafeInteger(event.version)) return;

            if (event.version <= lastVersion) return;

            lastVersion = event.version;

            queryClient.setQueryData<Order>(
                ["order", orderId],
                (previous) =>
                    previous
                        ? {
                            ...previous,
                            status: event.status,
                        }
                        : previous
            );
        }

        socket.on("connect", subscribe);
        socket.on("order.updated", handleOrderUpdated);

        if (socket.connected) {
            subscribe();
        }

        return () => {
            socket.off("connect", subscribe);
            socket.off("order.updated", handleOrderUpdated);
            socket.emit("order.unsubscribe", orderId);
        };
    }, [orderId, queryClient]);
}
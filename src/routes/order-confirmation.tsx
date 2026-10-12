import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";

import { buscarPedido } from "@/services/orders";
import { useOrderSocket } from "@/hooks/use-order-socket";

export default function OrderConfirmation() {
    const { orderId } = useParams({
        from: "/order/$orderId",
    });

    useOrderSocket(orderId);

    const { data: order, isPending, isError } = useQuery({
        queryKey: ["order", orderId],
        queryFn: () => buscarPedido(orderId),
    });

    if (isPending) {
        return <p className="p-8">Carregando pedido...</p>;
    }

    if (isError) {
        return <p className="p-8">Pedido não encontrado.</p>;
    }

    return (
        <main className="mx-auto max-w-3xl p-8">
            <h1 className="mb-4 text-3xl font-bold">
                {order.status === "confirmed"
                    ? "Compra confirmada!"
                    : "Pedido recebido"}
            </h1>

            <p className="mb-6 text-zinc-500">
                {order.status === "confirmed"
                    ? "Seu pedido foi registrado com sucesso!"
                    : "Seu pedido foi recebido e aguarda confirmação."}
            </p>

            <p className="mb-6">
                Status:{" "}
                <strong>
                    {order.status === "pending"
                        ? "Aguardando confirmação"
                        : order.status === "confirmed"
                            ? "Compra confirmada"
                            : "Pedido cancelado"}
                </strong>
            </p>

            <div className="rounded-xl border border-zinc-800 p-6">
                <p className="mb-4 text-sm">
                    Pedido: <strong>{order.id}</strong>
                </p>

                <div className="space-y-3">
                    {order.items.map((item) => (
                        <div
                            key={item.nftId}
                            className="flex justify-between"
                        >
                            <span>{item.name}</span>
                            <span>{item.priceEth} ETH</span>
                        </div>
                    ))}
                </div>

                <div className="mt-6 border-t border-zinc-800 pt-4">
                    <p>Subtotal: {order.subtotalEth} ETH</p>
                    <p>Desconto: {order.discountEth} ETH</p>

                    <p className="mt-3 text-xl font-bold">
                        Total pago: {order.totalEth} ETH
                    </p>
                </div>
            </div>

            <Link
                to="/"
                search={{
                    search: "",
                    sort: "recent",
                    page: 1,
                }}
                className="mt-8 inline-block underline"
            >
                Voltar ao marketplace
            </Link>
        </main>
    );
}
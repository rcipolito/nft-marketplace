import { createServer } from "node:http";
import { Server } from "socket.io";

type OrderStatus = "pending" | "confirmed" | "cancelled";

type OrderState = {
    id: string;
    status: OrderStatus;
    version: number;
    accessToken: string;
};

const nftPrices = new Map([
    ["1", { priceEth: "0.25", version: 1 }],
    ["2", { priceEth: "0.50", version: 1 }],
    ["3", { priceEth: "1.20", version: 1 }],
]);

const orders = new Map<string, OrderState>();

const allowedOrigin =
    process.env.FRONTEND_URL ?? "http://localhost:5173";

const port = Number(process.env.PORT ?? 3001);

const httpServer = createServer(async (request, response) => {
    response.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    response.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS"
    );
    response.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );

    if (request.method === "OPTIONS") {
        response.writeHead(204);
        response.end();
        return;
    }

    if (request.method === "GET" && request.url === "/api/prices") {
        response.writeHead(200, {
            "Content-Type": "application/json",
        });

        response.end(JSON.stringify(Object.fromEntries(nftPrices)));
        return;
    }

    response.writeHead(404);
    response.end();
});

const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigin,
    },
});

let priceVersion = 1;

io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);

    socket.on(
        "order.subscribe",
        (
            input: { orderId: string; accessToken: string },
            callback?: (result: { ok: boolean }) => void
        ) => {
            const order = orders.get(input?.orderId);

            if (!order || order.accessToken !== input.accessToken) {
                callback?.({ ok: false });
                return;
            }

            socket.join(`order:${order.id}`);

            callback?.({ ok: true });

            socket.emit("order.updated", {
                id: order.id,
                status: order.status,
                version: order.version,
            });
        }
    );

    socket.on("order.unsubscribe", (orderId: string) => {
        socket.leave(`order:${orderId}`);
    });

    socket.on(
        "order.register",
        (
            input: { orderId: string; accessToken: string },
            callback?: (result: { ok: boolean }) => void
        ) => {
            if (
                !input?.orderId ||
                !input?.accessToken ||
                orders.has(input.orderId)
            ) {
                callback?.({ ok: false });
                return;
            }

            orders.set(input.orderId, {
                id: input.orderId,
                status: "pending",
                version: 1,
                accessToken: input.accessToken,
            });

            callback?.({ ok: true });

            setTimeout(() => {
                const order = orders.get(input.orderId);

                if (!order || order.status !== "pending") return;

                order.status = "confirmed";
                order.version++;

                io.to(`order:${order.id}`).emit("order.updated", {
                    id: order.id,
                    status: order.status,
                    version: order.version,
                });
            }, 5000);
        }
    );
});

setInterval(() => {
    priceVersion++;

    const priceEth =
        priceVersion % 2 === 0 ? "0.30" : "0.25";

    nftPrices.set("1", {
        priceEth,
        version: priceVersion,
    });

    io.emit("nft.updated", {
        id: "1",
        priceEth,
        version: priceVersion,
    });
}, 15000);

httpServer.listen(port, "0.0.0.0", () => {
    console.log(`Servidor Socket.IO na porta ${port}`);
});
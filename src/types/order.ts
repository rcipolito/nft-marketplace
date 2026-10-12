export type OrderItem = {
    nftId: string;
    name: string;
    priceEth: string;
};

export type Order = {
    id: string;
    items: OrderItem[];
    subtotalEth: string;
    discountEth: string;
    totalEth: string;
    coupon: string | null;
    status: "pending" | "confirmed" | "cancelled";
    createdAt: string;
};

export type CreateOrderInput = {
    nftIds: string[];
    coupon: string;
    idempotencyKey: string;
};
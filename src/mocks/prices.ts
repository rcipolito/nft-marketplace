type PriceData = {
    priceEth: string;
    version: number;
};

export async function loadCurrentPrices(): Promise<
    Record<string, PriceData>
> {
    const socketUrl =
        import.meta.env.VITE_SOCKET_URL ?? "http://localhost:3001";

    const response = await fetch(`${socketUrl}/api/prices`);

    if (!response.ok) {
        throw new Error("Não foi possível consultar os preços");
    }

    return response.json();
}
import { useEffect, useState } from "react";

const collections = [
    "Arte digital",
    "Fotografia",
    "Música",
    "Arte 3D",
    "Colecionáveis",
    "Generativa",
    "Jogos",
];

const networks = ["Ethereum", "Polygon", "Solana"];

type NftFiltersProps = {
    maxPrice: number;
    onApplyPrice: (price: number) => void;
};

export default function NftFilters({
    maxPrice,
    onApplyPrice,
}: NftFiltersProps) {
    const [price, setPrice] = useState(maxPrice);

    useEffect(() => {
        setPrice(maxPrice);
    }, [maxPrice]);

    return (
        <aside className="space-y-8 bg-[#291a16] p-5 text-[#f4e9dc]">
            <div>
                <h2 className="mb-4 text-sm font-semibold">
                    Coleções
                </h2>

                <ul className="space-y-3">
                    {collections.map((collection) => (
                        <li key={collection}>
                            <span className="text-xs text-[#c5b4a8]">
                                {collection}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h2 className="mb-4 text-sm font-semibold">
                    Faixa de preço
                </h2>

                <label
                    htmlFor="nft-price"
                    className="mb-3 block text-xs text-[#c5b4a8]"
                >
                    Até {price.toFixed(2)} ETH
                </label>

                <input
                    id="nft-price"
                    type="range"
                    min="0"
                    max="12.3"
                    step="0.1"
                    value={price}
                    onChange={(event) =>
                        setPrice(Number(event.target.value))
                    }
                    className="w-full accent-[#d58b50]"
                />

                <button
                    type="button"
                    onClick={() => onApplyPrice(price)}
                    className="mt-4 rounded bg-[#d58b50] px-4 py-2 text-xs font-bold text-[#150d0a] hover:bg-[#e5a16a]"
                >
                    Aplicar
                </button>
            </div>

            <div>
                <h2 className="mb-4 text-sm font-semibold">
                    Rede
                </h2>

                <ul className="space-y-3">
                    {networks.map((network) => (
                        <li key={network}>
                            <span className="text-xs text-[#c5b4a8]">
                                {network}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}


import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

import type { Nft } from "@/types/nft";

type NftCardProps = {
    nft: Nft;
    isFavorite: boolean;
    onToggleFavorite: (id: string) => void;
};

export default function NftCard({
    nft,
    isFavorite,
    onToggleFavorite,
}: NftCardProps) {
    return (
        <article className="group overflow-hidden">
            <div className="relative overflow-hidden p-0">
                <Link
                    to="/nft/$nftId"
                    params={{ nftId: nft.id }}
                    className="block overflow-hidden bg-[#291a16] px-0 pb-5 pt-10"
                >
                    <img
                        src={nft.image}
                        alt={nft.name}
                        loading="lazy"
                        className="rounded-lg aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </Link>

                <button
                    type="button"
                    onClick={() => onToggleFavorite(nft.id)}
                    aria-label={
                        isFavorite
                            ? `Remover ${nft.name} dos favoritos`
                            : `Adicionar ${nft.name} aos favoritos`
                    }
                    aria-pressed={isFavorite}
                    className="absolute right-4 top-4 rounded-full bg-[#150d0a]/80 p-2 text-white transition-colors hover:text-[#d58b50]"
                >
                    <Heart
                        size={18}
                        fill={isFavorite ? "currentColor" : "none"}
                        className={isFavorite ? "text-[#d58b50]" : ""}
                    />
                </button>
            </div>

            <Link
                to="/nft/$nftId"
                params={{ nftId: nft.id }}
                className="block px-0 pb-0 pt-4"
            >
                <h2 className="truncate text-sm font-semibold text-[#f4e9dc]">
                    {nft.name}
                </h2>

                <p className="mt-3 text-sm font-bold text-[#d58b50]">
                    {nft.priceEth} ETH
                </p>
            </Link>
        </article>
    );
}

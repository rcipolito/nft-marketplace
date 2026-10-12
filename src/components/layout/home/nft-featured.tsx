
import { Link } from "@tanstack/react-router";

export default function FeaturedNft() {
    return (
        <aside
            aria-label="NFT em destaque"
            className="overflow-hidden bg-[#291a16]"
        >
            <div className="px-4 pt-5 pb-4">
                <p className="text-sm font-bold uppercase text-[#d58b50]">
                    NFT em destaque
                </p>

                <h2 className="mt-2 text-sm font-bold uppercase text-[#f4e9dc]">
                    Oferta limitada
                </h2>
            </div>

            <Link
                to="/nft/$nftId"
                params={{ nftId: "2" }}
                className="block overflow-hidden rounded-lg"
                aria-label="Ver NFT em destaque"
            >
                <img
                    src="/images/nft-02.png"
                    alt="NFT em destaque da coleção KURIO"
                    loading="lazy"
                    className="aspect-square w-full object-cover transition-transform duration-300 hover:scale-105"
                />
            </Link>
        </aside>
    );
}

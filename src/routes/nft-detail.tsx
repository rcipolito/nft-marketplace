import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { buscarNftPorId } from "@/services/nfts";
import { useCart } from "@/providers/cart-provider";
import { Button } from "@/components/ui/button";

export default function NftDetail() {
    const { nftId } = useParams({
        from: "/nft/$nftId",
    });

    const {
        data: nft,
        isPending,
        isError,
    } = useQuery({
        queryKey: ["nft", nftId],
        queryFn: () => buscarNftPorId(nftId),
    });

    const { addItem, isInCart } = useCart();

    if (isPending) {
        return <p className="p-8">Carregando NFT...</p>;
    }

    if (isError) {
        return <p className="p-8">Não foi possível carregar este NFT.</p>;
    }

    return (
        <main className="mx-auto grid max-w-6xl gap-8 p-8 md:grid-cols-2">
            <img
                src={nft.image}
                alt={nft.name}
                className="w-full rounded-xl"
            />

            <div>
                <h1 className="text-3xl font-bold">{nft.name}</h1>

                <p className="mt-3 text-zinc-500">
                    Criado por {nft.creator}
                </p>

                <p className="mt-8 text-2xl font-bold">
                    {nft.priceEth} ETH
                </p>

                <Button
                    className="mt-6"
                    disabled={isInCart(nft.id)}
                    onClick={() => addItem(nft.id)}
                >
                    {isInCart(nft.id)
                        ? "Adicionado ao carrinho"
                        : "Adicionar ao carrinho"}
                </Button>
            </div>
        </main>
    );
}
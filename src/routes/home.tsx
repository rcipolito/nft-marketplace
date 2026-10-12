import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";

import HeroBanner from "@/components/layout/home/hero-banner";
import NftFiltersSidebar from "@/components/layout/home/nft-filters";
import FeaturedNft from "@/components/layout/home/nft-featured";
import NftTabs from "@/components/layout/home/nft-tabs";
import PromoBanners from "@/components/layout/home/promo-banners";
import BlogSection from "@/components/layout/home/blog-section";

import NftCard from "@/components/nft/nft-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { buscarNfts } from "@/services/nfts";
import type { NftFilters } from "@/services/nfts";
import { useFavorites } from "@/hooks/use-favorites";

export default function Home() {
    const filters = useSearch({ from: "/" });
    const navigate = useNavigate({ from: "/" });
    const { favorites, toggleFavorite, isFavorite } = useFavorites();

    function updateFilters(changes: Partial<NftFilters>) {
        navigate({
            search: (previous) => ({
                ...previous,
                ...changes,
            }),
        });
    }

    const { data, isPending, isError, isFetching, refetch } = useQuery({
        queryKey: ["nfts", filters],
        queryFn: () => buscarNfts(filters),
    });

    return (
        <main className="min-h-screen bg-[#150d0a] text-[#f4e9dc]">
            <div className="mx-auto max-w-7xl px-6">
                <HeroBanner />

                <section id="catalogo" className="py-12">
                    <div className="grid items-start gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
                        <div className="space-y-6">
                            <NftFiltersSidebar
                                maxPrice={filters.maxPrice ?? 12.3}
                                onApplyPrice={(price) =>
                                    updateFilters({
                                        maxPrice: price,
                                        page: 1,
                                    })
                                }
                            />
                            <FeaturedNft />
                        </div>

                        <div className="min-w-0">
                            <div className="min-w-0">
                                <NftTabs />

                                <div className="mb-8 flex flex-col gap-4 sm:flex-row">
                                    <span>Ordenar por:</span>

                                    <select
                                        value={filters.sort}
                                        onChange={(event) =>
                                            updateFilters({
                                                sort: event.target.value as NftFilters["sort"],
                                                page: 1,
                                            })
                                        }
                                        aria-label="Ordenar NFTs"
                                        className="rounded border border-[#38251e] bg-[#291a16] px-4 py-2 text-sm text-[#f4e9dc]"
                                    >
                                        <option value="recent">Mais recentes</option>
                                        <option value="price_asc">Menor preço</option>
                                        <option value="price_desc">Maior preço</option>
                                    </select>
                                </div>
                            </div>

                            {isPending ? (
                                <p>Carregando NFTs...</p>
                            ) : isError ? (
                                <div>
                                    <p>Não foi possível carregar os NFTs.</p>
                                    <Button onClick={() => refetch()} className="mt-4">
                                        Tentar novamente
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    {isFetching && (
                                        <p role="status" className="mb-4 text-sm text-zinc-500">
                                            Atualizando resultados...
                                        </p>
                                    )}

                                    {data.items.length === 0 ? (
                                        <p>Nenhum NFT encontrado para sua pesquisa.</p>
                                    ) : (
                                        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                            {data.items.map((nft) => (
                                                <NftCard
                                                    key={nft.id}
                                                    nft={nft}
                                                    isFavorite={isFavorite(nft.id)}
                                                    onToggleFavorite={toggleFavorite}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    <div className="mt-8 flex items-center justify-center gap-4">
                                        <Button
                                            variant="outline"
                                            disabled={filters.page <= 1}
                                            onClick={() =>
                                                updateFilters({ page: filters.page - 1 })
                                            }
                                            className="border-[#57351f] bg-[#291a16] text-[#f4e9dc] hover:bg-[#3a2110] disabled:opacity-40"
                                        >
                                            Anterior
                                        </Button>

                                        <span>
                                            Página {filters.page} de {Math.max(1, data.totalPages)}
                                        </span>

                                        <Button
                                            variant="outline"
                                            disabled={filters.page >= data.totalPages}
                                            onClick={() =>
                                                updateFilters({ page: filters.page + 1 })
                                            }
                                            className="border-[#57351f] bg-[#291a16] text-[#f4e9dc] hover:bg-[#3a2110] disabled:opacity-40"
                                        >
                                            Próxima
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </section>

                <PromoBanners />

                <BlogSection />
            </div>
        </main>
    );
}

import { Link } from "@tanstack/react-router";

export default function HeroBanner() {
    return (
        <section
            aria-label="Destaque principal"
            className="grid items-center gap-12 py-16 lg:grid-cols-[1.3fr_1fr] lg:gap-20 lg:py-20"
        >
            {/* Conteúdo */}
            <div className="flex flex-col">
                <p className="mb-5 text-xs tracking-[0.15em]">
                    Bem-vindo à Kurio
                </p>

                <h1 className="text-3xl font-bold uppercase leading-[1.4] tracking-tight lg:text-[36px]">
                    <span className="block">Seja dono do futuro</span>
                    <span className="block">da arte digital</span>
                </h1>

                <p className="mt-5 max-w-[480px] text-sm leading-7 text-[#c8a98a]">
                    Descubra NFTs selecionados de criadores emergentes e
                    consagrados. Colecione arte digital rara, apoie artistas
                    e tenha uma parte da cultura da internet.
                </p>

                <Link
                    to="/"
                    hash="catalogo"
                    className="mt-7 inline-flex w-fit items-center justify-center rounded bg-[#d58b50] px-7 py-3 text-sm font-bold text-[#150d0a] transition-colors hover:bg-[#e5a16a]"
                >
                    EXPLORAR
                </Link>

                {/* Indicadores decorativos do Hero */}
                <div
                    className="mt-12 flex items-center justify-center gap-2 lg:justify-end"
                    aria-hidden="true"
                >
                    <span className="h-2 w-2 rounded-full bg-[#d58b50]" />
                    <span className="h-2 w-2 rounded-full bg-[#805036]" />
                    <span className="h-2 w-2 rounded-full bg-[#805036]" />
                </div>
            </div>

            {/* Imagem principal */}
            <div className="flex justify-center lg:justify-end">
                <img
                    src="/images/nft-01.png"
                    alt="Arte digital em destaque na KURIO"
                    fetchPriority="high"
                    className="aspect-square w-full max-w-[420px] rounded-2xl object-cover"
                />
            </div>
        </section>
    );
}

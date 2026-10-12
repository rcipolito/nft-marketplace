import { Link } from "@tanstack/react-router";

const banners = [
    {
        title: "Lançamentos genesis de edição limitada",
        description:
            "Colecione edições escassas diretamente dos criadores antes da revelação pública.",
        image: "/images/nft-01.png",
    },
    {
        title: "Arte digital selecionada e muito mais",
        description:
            "Explore novos artistas, coleções verificadas e obras digitais que definem a cultura.",
        image: "/images/nft-03.png",
    },
];

export default function PromoBanners() {
    return (
        <section
            aria-label="Destaques do marketplace"
            className="grid gap-5 py-16 md:grid-cols-2"
        >
            {banners.map((banner) => (
                <article
                    key={banner.title}
                    className="grid overflow-hidden rounded-lg bg-[#291a16] sm:grid-cols-2"
                >
                    <img
                        src={banner.image}
                        alt=""
                        loading="lazy"
                        className="aspect-square h-full w-full object-cover"
                    />

                    <div className="flex flex-col items-center justify-center p-6 text-center">
                        <h2 className="text-lg font-bold text-[#f4e9dc]">
                            {banner.title}
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-[#c8a98a]">
                            {banner.description}
                        </p>

                        <Link
                            to="/"
                            hash="catalogo"
                            className="mt-5 rounded bg-[#d58b50] px-5 py-2 text-sm font-semibold text-[#150d0a] hover:bg-[#e5a16a]"
                        >
                            Explorar →
                        </Link>
                    </div>
                </article>
            ))}
        </section>
    );
}
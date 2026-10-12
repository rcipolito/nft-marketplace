
type Article = {
    id: number;
    title: string;
    description: string;
    date: string;
    readingTime: string;
    image: string;
};

const articles: Article[] = [
    {
        id: 1,
        title: "Como funciona a propriedade de NFTs",
        description:
            "Aprenda a colecionar, negociar e verificar ativos digitais.",
        date: "12 de setembro",
        readingTime: "6 min",
        image: "/images/nft-03.png",
    },
    {
        id: 2,
        title: "10 artistas digitais para acompanhar",
        description:
            "Conheça criadores que moldam a cultura digital.",
        date: "13 de setembro",
        readingTime: "2 min",
        image: "/images/nft-01.png",
    },
    {
        id: 3,
        title: "Raridade, atributos e procedência",
        description:
            "Entenda raridade, procedência, direitos autorais e utilidade.",
        date: "15 de setembro",
        readingTime: "3 min",
        image: "/images/nft-02.png",
    },
    {
        id: 4,
        title: "Como proteger sua carteira",
        description:
            "Proteja suas carteiras, seus ativos e sua identidade.",
        date: "15 de setembro",
        readingTime: "2 min",
        image: "/images/nft-04.png",
    },
];

export default function BlogSection() {
    return (
        <section
            id="aprenda"
            aria-labelledby="blog-title"
            className="py-16"
        >
            <div className="mb-10 text-center">
                <h2
                    id="blog-title"
                    className="text-2xl font-bold text-[#f4e9dc] md:text-3xl"
                >
                    Diário da Cunhagem
                </h2>

                <p className="mt-3 text-sm text-[#c8a98a]">
                    Histórias, guias e insights para colecionadores
                    sobre o universo da propriedade digital.
                </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {articles.map((article) => (
                    <article
                        key={article.id}
                        className="overflow-hidden rounded-md bg-[#291a16]"
                    >
                        <img
                            src={article.image}
                            alt=""
                            loading="lazy"
                            className="aspect-square w-full object-cover"
                        />

                        <div className="p-4">
                            <p className="mb-3 text-xs text-[#c8a98a]">
                                {article.date} | Leitura de {article.readingTime}
                            </p>

                            <h3 className="mb-3 text-base font-bold text-[#f4e9dc]">
                                {article.title}
                            </h3>

                            <p className="text-sm leading-6 text-[#c8a98a]">
                                {article.description}
                            </p>

                            <span className="mt-4 inline-block text-sm font-semibold text-[#d58b50]">
                                Artigo em breve
                            </span>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

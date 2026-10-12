
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Share2 } from "lucide-react";

const benefits = [
    {
        icon: "W",
        title: "Segurança da carteira",
        description:
            "Proteja sua carteira e colecione arte digital verificada com confiança.",
    },
    {
        icon: "C",
        title: "Criadores em destaque",
        description:
            "Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.",
    },
    {
        icon: "D",
        title: "Alertas de lançamentos",
        description:
            "Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.",
    },
];

const profileLinks = [
    { label: "Meu perfil", to: "/profile" },
    { label: "Minha coleção", to: "/profile" },
    { label: "Atividade", to: "/profile" },
    { label: "Estúdio do criador", to: "/profile" },
    { label: "Lista de interesse", to: "/" },
] as const;

const helpLinks = [
    "Central de ajuda",
    "Como comprar NFTs",
    "Carteira e segurança",
    "Política do mercado",
    "Denunciar item",
];

const collections = [
    "Arte digital",
    "Fotografia",
    "Música",
    "Arte 3D",
    "Utilidade",
];

export default function Footer() {
    const [email, setEmail] = useState("");

    function handleNewsletter(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        // Integração com newsletter será implementada posteriormente.
        // Por enquanto, não enviamos nem armazenamos o e-mail.
    }

    return (
        <footer className="bg-[#150d0a] px-4 pt-16 text-[#f4e9dc] sm:px-6">
            <div className="mx-auto max-w-7xl">
                {/* Benefícios e newsletter */}
                <div className="grid gap-10 bg-[#291a16] px-6 py-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-0">
                    {benefits.map((benefit) => (
                        <div
                            key={benefit.icon}
                            className="lg:border-r lg:border-[#d58b50] lg:px-5 first:lg:pl-0"
                        >
                            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#d58b50] text-2xl font-bold text-[#150d0a]">
                                {benefit.icon}
                            </div>

                            <h3 className="mb-3 text-lg font-bold">
                                {benefit.title}
                            </h3>

                            <p className="max-w-xs text-sm leading-6 text-[#c8a98a]">
                                {benefit.description}
                            </p>
                        </div>
                    ))}

                    <div className="lg:pl-5">
                        <h3 className="mb-5 text-xl font-bold leading-tight">
                            Antecipe-se ao próximo lançamento
                        </h3>

                        <form onSubmit={handleNewsletter}>
                            <div className="flex overflow-hidden rounded-md bg-[#3a2110]">
                                <input
                                    type="email"
                                    aria-label="E-mail para newsletter"
                                    placeholder="Digite seu e-mail..."
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-[#f4e9dc] outline-none placeholder:text-[#b99570]"
                                    required
                                />

                                <button
                                    type="submit"
                                    disabled
                                    title="Inscrições disponíveis em breve"
                                    className="bg-[#d58b50] px-4 py-3 font-bold text-[#150d0a] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Enviar
                                </button>
                            </div>
                        </form>

                        <p className="mt-4 text-sm leading-6 text-[#c8a98a]">
                            Receba lançamentos selecionados, histórias de criadores
                            e novidades do mercado.
                        </p>

                        <p className="mt-2 text-xs text-[#c8a98a]">
                            Inscrições disponíveis em breve.
                        </p>
                    </div>
                </div>

                {/* Faixa institucional */}
                <div className="grid gap-5 bg-[#3a2110] px-6 py-7 text-sm md:grid-cols-2 lg:grid-cols-4 lg:items-center">
                    <span className="font-bold tracking-widest">
                        KURIO
                    </span>

                    <p>Feito para colecionadores, criadores e cultura</p>

                    <span>contato@email.com</span>

                    <span>+55 11 4002 8922</span>
                </div>

                {/* Links e redes sociais */}
                <div className="grid gap-10 bg-[#291a16] px-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <h3 className="mb-5 text-lg font-bold">
                            Meu perfil
                        </h3>

                        <ul className="space-y-3 text-sm">
                            {profileLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.to}
                                        className="hover:text-[#d58b50]"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-5 text-lg font-bold">
                            Central de ajuda
                        </h3>

                        <ul className="space-y-3 text-sm">
                            {helpLinks.map((link) => (
                                <li key={link} className="text-[#c8a98a]">
                                    {link}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-5 text-lg font-bold">
                            Coleções
                        </h3>

                        <ul className="space-y-3 text-sm">
                            {collections.map((collection) => (
                                <li key={collection} className="text-[#c8a98a]">
                                    {collection}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-5 text-lg font-bold">
                            Redes sociais
                        </h3>

                        <div className="mb-9 flex flex-wrap gap-2">
                            {["Facebook", "Instagram", "Twitter", "LinkedIn", "YouTube"].map(
                                (network) => (
                                    <span
                                        key={network}
                                        title={network}
                                        aria-label={network}
                                        className="flex h-9 w-9 items-center justify-center rounded border border-[#d58b50] text-[#d58b50]"
                                    >
                                        <Share2 size={18} aria-hidden="true" />
                                    </span>
                                )
                            )}
                        </div>

                        <h3 className="mb-3 text-lg font-bold">
                            Carteiras compatíveis
                        </h3>

                        <p className="inline-block rounded border border-[#57351f] bg-[#3a2110] px-3 py-2 text-[10px] font-bold text-[#d58b50]">
                            METAMASK · WALLETCONNECT · COINBASE
                        </p>
                    </div>
                </div>
            </div>

            {/* Direitos autorais */}
            <div className="py-5 text-center text-xs text-[#f4e9dc]">
                © 2026 Kurio. Propriedade digital para todos.
            </div>
        </footer>
    );
}

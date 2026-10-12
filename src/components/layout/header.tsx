
import { Link } from "@tanstack/react-router";
import { ShoppingCart, Heart, Search } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

export default function Header() {
    const { user, signOut } = useAuth();

    return (
        <header className="border-b border-[#38251e] bg-[#150d0a] text-[#f4e9dc]">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
                <Link
                    to="/"
                    search={{
                        search: "",
                        sort: "recent",
                        page: 1,
                    }}
                    className="text-sm font-bold tracking-[0.25em]"
                >
                    KURIO
                </Link>

                <nav
                    aria-label="Navegação principal"
                    className="order-3 flex w-full items-center justify-center gap-5 text-xs sm:order-none sm:w-auto sm:gap-8"
                >
                    <Link to="/" search={{
    search: "",
    sort: "recent",
    page: 1,
  }} className="text-[#d58b50]">
                        Início
                    </Link>

                    <Link to="/" search={{
    search: "",
    sort: "recent",
    page: 1,
  }} hash="catalogo" className="hover:text-[#d58b50]">
                        Mercado
                    </Link>

                    <a href="#criadores" className="hover:text-[#d58b50]">
                        Criadores
                    </a>

                    <a href="#aprenda" className="hover:text-[#d58b50]">
                        Aprenda
                    </a>
                </nav>

                <div className="flex items-center gap-4">
                    <Link
                        to="/"
                        search={{
                            search: "",
                            sort: "recent",
                            page: 1,
                        }}
                        hash="catalogo"
                        aria-label="Buscar NFTs"
                        className="hover:text-[#d58b50]"
                    >
                        <Search size={18} />
                    </Link>

                    <Link
                        to="/cart"
                        aria-label="Carrinho"
                        className="hover:text-[#d58b50]"
                    >
                        <ShoppingCart size={18} />
                    </Link>

                    <button
                        type="button"
                        aria-label="Favoritos"
                        className="hover:text-[#d58b50]"
                    >
                        <Heart size={18} />
                    </button>

                    {user ? (
                        <div className="flex items-center gap-3 text-xs">
                            <Link to="/profile" className="hover:text-[#d58b50]">
                                {user.name}
                            </Link>

                            <Link to="/wallets" className="hover:text-[#d58b50]">
                                Carteiras
                            </Link>

                            <button
                                type="button"
                                onClick={signOut}
                                className="hover:text-[#d58b50]"
                            >
                                Sair
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="rounded bg-[#d58b50] px-4 py-2 text-xs font-semibold text-[#150d0a] hover:bg-[#e5a16a]"
                        >
                            Entrar
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}

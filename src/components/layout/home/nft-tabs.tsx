export default function NftTabs() {
    return (
        <div className="flex flex-wrap items-center gap-6 border-b border-[#38251e] pb-3">
            <span className="border-b-2 border-[#d58b50] pb-3 text-xs font-semibold text-[#d58b50]">
                Todos os NFTs
            </span>

            <span className="pb-3 text-xs text-[#a99588]">
                Novos lançamentos
            </span>

            <span className="pb-3 text-xs text-[#a99588]">
                Em alta
            </span>
        </div>
    );
}
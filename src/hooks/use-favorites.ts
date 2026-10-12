import { useEffect, useState } from "react";

const STORAGE_KEY = "nft-favorites";

function loadFavorites(): string[] {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) return [];

        const parsed: unknown = JSON.parse(saved);

        if (
            Array.isArray(parsed) &&
            parsed.every((id) => typeof id === "string")
        ) {
            return parsed;
        }

        return [];
    } catch {
        return [];
    }
}

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>(loadFavorites);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    }, [favorites]);

    function toggleFavorite(id: string) {
        setFavorites((previous) => {
            if (previous.includes(id)) {
                return previous.filter((item) => item !== id);
            }

            return [...previous, id];
        });
    }

    function isFavorite(id: string) {
        return favorites.includes(id);
    }

    return {
        favorites,
        toggleFavorite,
        isFavorite,
    };
}
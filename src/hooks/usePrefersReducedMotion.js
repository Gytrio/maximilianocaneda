import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/* Devuelve true si el visitante pidio reducir animaciones en su sistema. */
export default function usePrefersReducedMotion() {
    const [reduced, setReduced] = useState(() => window.matchMedia?.(QUERY).matches ?? false);

    useEffect(() => {
        const media = window.matchMedia?.(QUERY);
        if (!media) {
            return undefined;
        }

        const sync = () => setReduced(media.matches);
        media.addEventListener("change", sync);
        return () => media.removeEventListener("change", sync);
    }, []);

    return reduced;
}

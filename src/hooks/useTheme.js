import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { MOTION } from "../config/motion";
import usePrefersReducedMotion from "./usePrefersReducedMotion";

const STORAGE_KEY = "portfolio-theme";

/* Tema de la primera visita. A pedido del usuario NO se mira prefers-color-scheme: el portfolio
   arranca siempre en claro y el tema oscuro queda detras del boton. index.html hace la misma cuenta
   antes del primer pintado. */
const DEFAULT_THEME = "light";

/* Lee el tema guardado; localStorage puede fallar en modo privado. */
const readStoredTheme = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored === "light" || stored === "dark" ? stored : "";
    } catch {
        return "";
    }
};

/* Sin Web Animations el circulo no puede crecer, asi que el cambio se hace instantaneo. */
const canAnimate = () => typeof Element.prototype.animate === "function";

/* Devuelve el tema vigente, el wipe circular en curso y un toggle que lo convierte en eleccion manual guardada. */
export default function useTheme() {
    const reduced = usePrefersReducedMotion();
    const [choice, setChoice] = useState(readStoredTheme);
    const [wipe, setWipe] = useState(null);
    const theme = choice || DEFAULT_THEME;

    const themeRef = useRef(theme);
    const reducedRef = useRef(reduced);
    const wipingRef = useRef(false);
    const wipeTimerRef = useRef(0);
    const fadeTimerRef = useRef(0);

    /* Refleja el tema en el documento antes del pintado y lo deja en refs para el toggle. */
    useLayoutEffect(() => {
        themeRef.current = theme;
        reducedRef.current = reduced;
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme, reduced]);

    /* Guarda la eleccion manual para la proxima visita. */
    useEffect(() => {
        if (!choice) {
            return;
        }

        try {
            localStorage.setItem(STORAGE_KEY, choice);
        } catch {
            /* Sin persistencia: la proxima visita vuelve a arrancar en claro. */
        }
    }, [choice]);

    /* Cancela los timers del wipe al desmontar. */
    useEffect(
        () => () => {
            clearTimeout(wipeTimerRef.current);
            clearTimeout(fadeTimerRef.current);
            wipeTimerRef.current = 0;
            fadeTimerRef.current = 0;
            wipingRef.current = false;
        },
        []
    );

    /* Cambia el tema tapando la pantalla con un circulo que nace en el boton; ignorado si ya hay uno en curso. */
    const toggleTheme = useCallback((origin) => {
        if (wipingRef.current) {
            return;
        }

        const next = themeRef.current === "dark" ? "light" : "dark";

        /* Sin animacion posible el cambio es seco y wipe queda en null. */
        if (reducedRef.current || !origin || !canAnimate()) {
            setChoice(next);
            return;
        }

        wipingRef.current = true;
        setWipe({ ...origin, to: next, phase: "wiping" });

        wipeTimerRef.current = setTimeout(() => {
            wipeTimerRef.current = 0;
            /* Pantalla tapada: se cambia el tema y el circulo arranca su fundido en el mismo tick. */
            setChoice(next);
            setWipe((current) => (current ? { ...current, phase: "fading" } : current));

            fadeTimerRef.current = setTimeout(() => {
                fadeTimerRef.current = 0;
                wipingRef.current = false;
                setWipe(null);
            }, MOTION.themeFade);
        }, MOTION.themeWipe);
    }, []);

    return { theme, wipe, toggleTheme };
}

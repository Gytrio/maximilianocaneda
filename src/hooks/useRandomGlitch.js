import { useEffect } from "react";
import usePrefersReducedMotion from "./usePrefersReducedMotion";

/* Valores por defecto: espera y duracion al azar (ms), cantidad de variantes del CSS y desplazamiento maximo (px). */
const DEFAULTS = {
    wait: [450, 2400],
    length: [110, 260],
    variants: 3,
    maxShift: 4,
};

/* Numero al azar entre min y max. */
const between = ([min, max]) => min + Math.random() * (max - min);

/* Mientras `enabled` es true, hace glitches cortos al azar sobre el elemento: cada tanto le pone
   data-glitch="1..variants" y --glitch-x (desplazamiento al azar) y al rato se los saca. Todo en el DOM, sin
   re-renderizar React. El aspecto de cada variante lo define src/styles/dotGlitch.css. */
export default function useRandomGlitch(ref, { enabled = true, ...options } = {}) {
    const reduced = usePrefersReducedMotion();
    const { wait, length, variants, maxShift } = { ...DEFAULTS, ...options };
    const [waitMin, waitMax] = wait;
    const [lengthMin, lengthMax] = length;

    /* Programa glitches con espera, duracion, variante y desplazamiento al azar. */
    useEffect(() => {
        const element = ref.current;
        if (!enabled || reduced || !element) {
            return undefined;
        }

        let waitTimer = 0;
        let stopTimer = 0;

        const schedule = () => {
            waitTimer = setTimeout(() => {
                const shift = (Math.random() < 0.5 ? -1 : 1) * between([1.5, maxShift]);
                element.style.setProperty("--glitch-x", `${shift.toFixed(1)}px`);
                element.dataset.glitch = String(1 + Math.floor(Math.random() * variants));
                stopTimer = setTimeout(() => {
                    delete element.dataset.glitch;
                    schedule();
                }, between([lengthMin, lengthMax]));
            }, between([waitMin, waitMax]));
        };

        schedule();
        return () => {
            clearTimeout(waitTimer);
            clearTimeout(stopTimer);
            delete element.dataset.glitch;
        };
    }, [ref, enabled, reduced, waitMin, waitMax, lengthMin, lengthMax, variants, maxShift]);
}

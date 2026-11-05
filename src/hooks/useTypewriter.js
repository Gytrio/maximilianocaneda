import { useLayoutEffect } from "react";
import { MOTION } from "../config/motion";
import usePrefersReducedMotion from "./usePrefersReducedMotion";

/* Indica si el nodo de texto debe animarse (no vacio, fuera de script/style y de data-typewriter="off"). */
function isAnimatable(node) {
    if (!node.nodeValue || node.nodeValue.trim() === "") {
        return false;
    }
    const parent = node.parentElement;
    if (!parent) {
        return false;
    }
    if (parent.closest("script, style")) {
        return false;
    }
    return !parent.closest('[data-typewriter="off"]');
}

/* Junta los nodos de texto animables bajo el contenedor con su texto original y duracion. */
function collectEntries(container) {
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    const entries = [];
    let node = walker.nextNode();
    while (node) {
        if (isAnimatable(node)) {
            const full = node.nodeValue;
            entries.push({
                node,
                full,
                last: full,
                duration: Math.min(MOTION.typeMax, full.length * MOTION.typeMsPerChar),
                done: false,
                released: false,
            });
        }
        node = walker.nextNode();
    }
    return entries;
}

/* Escribe en paralelo todo el texto del contenedor con un unico loop de requestAnimationFrame. */
export default function useTypewriter(containerRef, { run, runKey }) {
    const reduced = usePrefersReducedMotion();

    /* Vacia los nodos antes del paint, anima todos a la vez y restaura el texto en el cleanup. */
    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!run || reduced || !container) {
            return undefined;
        }

        const entries = collectEntries(container);
        if (entries.length === 0) {
            return undefined;
        }

        for (const entry of entries) {
            entry.node.nodeValue = "";
            entry.last = "";
        }

        const start = performance.now();
        let rafId = 0;

        /* Avanza todos los nodos segun el tiempo transcurrido y corta el loop cuando terminan. */
        const tick = (now) => {
            const elapsed = Math.max(0, now - start);
            let pending = 0;

            for (const entry of entries) {
                if (entry.done) {
                    continue;
                }
                if (entry.node.nodeValue !== entry.last) {
                    // React cambio el nodo: se suelta y no se vuelve a tocar.
                    entry.done = true;
                    entry.released = true;
                    continue;
                }
                const ratio = entry.duration > 0 ? Math.min(1, elapsed / entry.duration) : 1;
                const value = entry.full.slice(0, Math.ceil(entry.full.length * ratio));
                if (value !== entry.last) {
                    entry.node.nodeValue = value;
                    entry.last = value;
                }
                if (ratio >= 1) {
                    entry.done = true;
                } else {
                    pending += 1;
                }
            }

            rafId = pending > 0 ? requestAnimationFrame(tick) : 0;
        };

        rafId = requestAnimationFrame(tick);

        return () => {
            if (rafId) {
                cancelAnimationFrame(rafId);
            }
            for (const entry of entries) {
                if (!entry.released && entry.node.nodeValue === entry.last) {
                    entry.node.nodeValue = entry.full;
                }
            }
        };
    }, [containerRef, run, runKey, reduced]);
}

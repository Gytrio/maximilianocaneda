import { useEffect, useRef, useState } from "react";
import { SCROLL } from "../config/motion";

/* Calcula el progreso de scroll del documento entre 0 y 1. */
function readProgress() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) {
        return 0;
    }
    /* El scroll maximo puede ser fraccional: a menos de 1px del final ya se considera llegada exacta. */
    if (maxScroll - window.scrollY < 1) {
        return 1;
    }
    return Math.min(1, Math.max(0, window.scrollY / maxScroll));
}

/* Aplica la histeresis: decide la fase siguiente segun la actual y el progreso. */
function nextPhase(current, p) {
    if (current === "hero") {
        return p >= SCROLL.enterSplit ? "split" : "hero";
    }
    return p <= SCROLL.leaveSplit ? "hero" : "split";
}

/* Escribe el progreso como custom property global sin pasar por React. */
function writeProgress(p) {
    document.documentElement.style.setProperty("--scroll-p", p.toFixed(4));
}

/* Histeresis propia del timeline: aparece en el tramo final del recorrido, antes de la llegada. */
function nextTimeline(current, p) {
    return current ? p > SCROLL.hideTimeline : p >= SCROLL.revealTimeline;
}

/* Liga el scroll a --scroll-p y devuelve la fase ("hero" | "split") y si el timeline ya debe mostrarse,
   ambos con histeresis. */
export default function useScrollPhase({ enabled }) {
    const [phase, setPhase] = useState(() => (enabled && readProgress() >= SCROLL.enterSplit ? "split" : "hero"));
    const [timelineRevealed, setTimelineRevealed] = useState(
        () => enabled && readProgress() >= SCROLL.revealTimeline
    );
    const phaseRef = useRef(phase);
    const timelineRef = useRef(timelineRevealed);

    /* Escucha scroll y resize, actualiza --scroll-p por frame y los estados solo cuando cambian. */
    useEffect(() => {
        if (!enabled) {
            writeProgress(0);
            phaseRef.current = "hero";
            timelineRef.current = false;
            const resetId = requestAnimationFrame(() => {
                setPhase("hero");
                setTimelineRevealed(false);
            });
            return () => cancelAnimationFrame(resetId);
        }

        let rafId = 0;

        const update = () => {
            rafId = 0;
            const p = readProgress();
            writeProgress(p);
            const next = nextPhase(phaseRef.current, p);
            if (next !== phaseRef.current) {
                phaseRef.current = next;
                setPhase(next);
            }
            const nextReveal = nextTimeline(timelineRef.current, p);
            if (nextReveal !== timelineRef.current) {
                timelineRef.current = nextReveal;
                setTimelineRevealed(nextReveal);
            }
        };

        const schedule = () => {
            if (!rafId) {
                rafId = requestAnimationFrame(update);
            }
        };

        update();
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule, { passive: true });

        return () => {
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
            if (rafId) {
                cancelAnimationFrame(rafId);
            }
            writeProgress(0);
        };
    }, [enabled]);

    return {
        phase: enabled ? phase : "hero",
        timelineRevealed: enabled && timelineRevealed,
    };
}

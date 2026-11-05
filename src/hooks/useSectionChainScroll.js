import { useEffect, useLayoutEffect, useRef } from "react";
import { SCROLL_CHAIN } from "../config/motion.js";
import { TIMELINE_SECTIONS } from "../sections/registry.js";

/* Cadena de secciones que recorre el scroll: solo las que se pueden abrir, en el orden del registro. */
const CHAIN = TIMELINE_SECTIONS.filter((section) => section.interactive).map((section) => section.id);

/* Contrato de seleccion (ver .claude/FLUJO-DE-DESARROLLO.md): el panel que scrollea y los dots de cada timeline.
   Durante un cambio de seccion puede quedar un panel viejo con .is-stale: ese no cuenta. */
const PANEL = ".stage-panel:not(.is-stale)";
const stripDot = (id) => `.identity-panel [data-timeline-id="${id}"] .tl-dot`;
const workspaceDot = (id) => `.workspace [data-timeline-id="${id}"] .tl-dot`;

/* Contrato generico: una seccion declara data-chain-hold="down" o "up" en el control que todavia tiene un paso
   propio en ese borde. Mientras ese control exista habilitado dentro del panel, la cadena le cede el gesto; el
   hook no conoce las clases de ninguna seccion. Si una seccion desmonta el control en vez de deshabilitarlo,
   alcanza con no renderizarlo: al no existir el nodo, la cadena actua igual. */
const INNER_STEP = {
    "1": '[data-chain-hold="down"]:not(:disabled)',
    "-1": '[data-chain-hold="up"]:not(:disabled)',
};

/* Teclas que dan un paso hacia adelante y hacia atras. */
const KEYS_NEXT = ["ArrowDown", "PageDown", " "];
const KEYS_PREV = ["ArrowUp", "PageUp"];

/* Firefox puede medir la rueda en lineas o en paginas: se pasa a px para comparar contra el umbral. */
const LINE_PX = 16;

/* Direccion de un paso segun la tecla: 1 abajo, -1 arriba, 0 si no es una tecla de la cadena. */
function keyDirection(key) {
    if (KEYS_NEXT.includes(key)) {
        return 1;
    }
    return KEYS_PREV.includes(key) ? -1 : 0;
}

/* Deja el teclado a quien lo tiene: campos de texto y la barra espaciadora de botones y enlaces. */
function keyBelongsToTarget(event) {
    const target = event.target;
    if (!target || typeof target.tagName !== "string") {
        return false;
    }
    if (target.isContentEditable) {
        return true;
    }
    if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) {
        return true;
    }
    const activates = target.tagName === "BUTTON" || target.tagName === "A" || target.getAttribute?.("role") === "button";
    return event.key === " " && activates;
}

/* Pasa el delta de la rueda a px segun la unidad que uso el navegador. */
function wheelPixels(event) {
    const amount = Math.abs(event.deltaY);
    if (event.deltaMode === 1) {
        return amount * LINE_PX;
    }
    return event.deltaMode === 2 ? amount * window.innerHeight : amount;
}

/* Dice si el panel ya no tiene recorrido en esa direccion (al tope o al final, con la tolerancia del contrato). */
function atEdge(panel, direction) {
    if (direction > 0) {
        return panel.scrollTop + panel.clientHeight >= panel.scrollHeight - SCROLL_CHAIN.edgeSlack;
    }
    return panel.scrollTop <= SCROLL_CHAIN.edgeSlack;
}

/* Primer dot que exista de la lista de selectores. */
function findDot(selectors) {
    for (const selector of selectors) {
        const dot = document.querySelector(selector);
        if (dot) {
            return dot;
        }
    }
    return null;
}

/* Encadena las secciones con el scroll: del timeline negro a la primera, y de cada seccion a la siguiente o la
   anterior cuando el panel llega a su borde. Reutiliza onSelect (la apertura por click) y onClose. */
export default function useSectionChainScroll({
    enabled,
    phase,
    timelineRevealed,
    status,
    activeId,
    onSelect,
    onClose,
}) {
    /* Estado que no debe provocar re-render: contexto del ultimo render, acumulador, direccion y cooldown. */
    const ctxRef = useRef({ enabled, phase, timelineRevealed, status, activeId, onSelect, onClose });
    const accumRef = useRef(0);
    const dirRef = useRef(0);
    const lastStepRef = useRef(0);
    const touchYRef = useRef(null);

    /* Los listeners leen siempre el ultimo render confirmado sin volver a registrarse. */
    useLayoutEffect(() => {
        ctxRef.current = { enabled, phase, timelineRevealed, status, activeId, onSelect, onClose };
    }, [enabled, phase, timelineRevealed, status, activeId, onSelect, onClose]);

    /* Reinicia el acumulador al cambiar de seccion o de estado, y abre una espera de cooldown al quedar abierta:
       asi la inercia del gesto que la abrio no salta de inmediato a la siguiente (secciones mas cortas que la
       pantalla incluidas). */
    useLayoutEffect(() => {
        accumRef.current = 0;
        dirRef.current = 0;
        touchYRef.current = null;
        lastStepRef.current = performance.now();
    }, [status, activeId]);

    useEffect(() => {
        if (!enabled) {
            return undefined;
        }

        /* Panel de la seccion abierta; se busca en cada gesto porque cambia con cada seccion. */
        const getPanel = () => document.querySelector(PANEL);

        /* Decide si la cadena puede actuar en esa direccion con el estado y el borde actuales. */
        const canChain = (direction, panel) => {
            const ctx = ctxRef.current;
            if (ctx.status === "idle") {
                /* Desde el timeline negro solo se baja: hacia arriba el documento tiene que volver al hero. */
                return direction > 0 && ctx.phase === "split" && ctx.timelineRevealed;
            }
            /* Solo con la seccion ya abierta: expanding, whiteout, entering y closing se dejan pasar. Un click
               si cuenta desde entering (no se pierde input), pero el gesto de scroll es continuo: aceptarlo ahi
               solo encadenaria dos pasos con la inercia del mismo gesto, y el cooldown ya cubre todo entering. */
            if (ctx.status !== "open" || !panel || !atEdge(panel, direction)) {
                return false;
            }
            return !panel.querySelector(INNER_STEP[direction]);
        };

        /* Abre una seccion desde el dot visible y marca el paso. El dot de la franja es el que se ve con una
           seccion abierta; el del area blanca, con el timeline negro. */
        const select = (id, fromStrip) => {
            const dot = findDot(fromStrip ? [stripDot(id), workspaceDot(id)] : [workspaceDot(id), stripDot(id)]);
            if (!dot) {
                return false;
            }
            ctxRef.current.onSelect?.(id, dot);
            lastStepRef.current = performance.now();
            accumRef.current = 0;
            return true;
        };

        /* Da un paso de la cadena. Devuelve true solo si consumio el gesto. */
        const advance = (direction) => {
            const ctx = ctxRef.current;
            if (ctx.status === "idle") {
                /* Deja el recorrido justo al final antes de abrir: --scroll-p queda en 1 y la franja completa,
                   aunque la fase split haya entrado unos px antes (histeresis). */
                window.scrollTo({ top: document.documentElement.scrollHeight - window.innerHeight, behavior: "instant" });
                return select(CHAIN[0], false);
            }

            const index = CHAIN.indexOf(ctx.activeId);
            if (index < 0) {
                return false;
            }
            const next = index + direction;
            /* Antes de la primera se vuelve al timeline negro; despues de la ultima no pasa nada (no cicla). */
            if (next < 0) {
                ctxRef.current.onClose?.();
                lastStepRef.current = performance.now();
                accumRef.current = 0;
                return true;
            }
            if (next >= CHAIN.length) {
                return false;
            }
            return select(CHAIN[next], true);
        };

        /* Suma el desplazamiento sobre el borde; cambiar de direccion reinicia la cuenta. */
        const overThreshold = (direction, pixels) => {
            if (direction !== dirRef.current) {
                dirRef.current = direction;
                accumRef.current = 0;
            }
            accumRef.current += pixels;
            return accumRef.current > SCROLL_CHAIN.threshold;
        };

        /* Logica comun de rueda y touch: acumula sobre el borde y devuelve true si la cadena consumio el gesto. */
        const consumeDrag = (direction, pixels) => {
            const panel = getPanel();
            if (!canChain(direction, panel)) {
                accumRef.current = 0;
                return false;
            }
            /* En el cooldown el acumulador se mantiene en cero: la cuenta arranca recien cuando vence. */
            if (performance.now() - lastStepRef.current < SCROLL_CHAIN.cooldown) {
                accumRef.current = 0;
                return false;
            }
            if (!overThreshold(direction, pixels)) {
                return false;
            }
            if (advance(direction)) {
                return true;
            }
            /* Nadie dio el paso (ultima seccion): no se guarda delta de mas. */
            accumRef.current = 0;
            return false;
        };

        const onWheel = (event) => {
            /* ctrl + rueda es zoom del navegador; un gesto ya consumido por la seccion tampoco se toca. */
            if (event.defaultPrevented || event.ctrlKey || Math.abs(event.deltaY) < 1) {
                return;
            }
            const direction = event.deltaY > 0 ? 1 : -1;
            if (consumeDrag(direction, wheelPixels(event))) {
                event.preventDefault();
            }
        };

        const onTouchStart = (event) => {
            touchYRef.current = event.touches.length === 1 ? event.touches[0].clientY : null;
            accumRef.current = 0;
        };

        const onTouchMove = (event) => {
            const start = touchYRef.current;
            const current = event.touches[0]?.clientY;
            if (event.defaultPrevented || start === null || current === undefined) {
                return;
            }
            /* Arrastrar hacia arriba equivale a bajar. */
            const delta = start - current;
            touchYRef.current = current;
            if (Math.abs(delta) < 1) {
                return;
            }
            if (consumeDrag(delta > 0 ? 1 : -1, Math.abs(delta))) {
                event.preventDefault();
            }
        };

        const onTouchEnd = () => {
            touchYRef.current = null;
            accumRef.current = 0;
        };

        /* Teclado: un paso por pulsacion (sin acumulador) y solo en el borde del panel. Escape, Tab y el scroll
           por teclado dentro del panel siguen intactos. */
        const onKeyDown = (event) => {
            if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
                return;
            }
            const direction = keyDirection(event.key);
            if (!direction || keyBelongsToTarget(event)) {
                return;
            }
            if (!canChain(direction, getPanel())) {
                return;
            }
            if (performance.now() - lastStepRef.current < SCROLL_CHAIN.cooldown) {
                return;
            }
            if (advance(direction)) {
                event.preventDefault();
            }
        };

        /* Rueda y touchmove no pasivos: hacen falta para poder frenar el gesto que la cadena consume. */
        window.addEventListener("wheel", onWheel, { passive: false });
        window.addEventListener("touchstart", onTouchStart, { passive: true });
        window.addEventListener("touchmove", onTouchMove, { passive: false });
        window.addEventListener("touchend", onTouchEnd, { passive: true });
        window.addEventListener("touchcancel", onTouchEnd, { passive: true });
        window.addEventListener("keydown", onKeyDown);

        return () => {
            window.removeEventListener("wheel", onWheel);
            window.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onTouchEnd);
            window.removeEventListener("touchcancel", onTouchEnd);
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [enabled]);
}

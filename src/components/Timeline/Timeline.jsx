import { useCallback, useEffect, useState } from "react";
import { EASING, MOTION } from "../../config/motion.js";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion.js";
import TimelineItem from "./TimelineItem.jsx";
import "./Timeline.css";

/* Duraciones de interaccion propias del timeline (no forman parte de la secuencia compartida). */
const HIDE_FADE_MS = 200;
const HOVER_MS = 160;

/* Retraso del segundo anillo de la ola respecto del primero. */
const RIPPLE_GAP_MS = 120;

/* Momento del impacto dentro del pop (su pico, 50%); la gota cae en ese mismo tramo para no retrasar nada. */
const IMPACT_MS = Math.round(MOTION.dotPop * 0.5);

/* Mide el centro del primer y ultimo dot y ajusta la linea vertical (::before de la lista) para unirlos. */
function fitLine(list) {
    const dots = list.querySelectorAll(".tl-dot");
    if (dots.length < 2) {
        return;
    }

    const listTop = list.getBoundingClientRect().top;
    const centerOf = (dot) => {
        const rect = dot.getBoundingClientRect();
        return rect.top + rect.height / 2 - listTop;
    };
    const first = centerOf(dots[0]);
    const last = centerOf(dots[dots.length - 1]);
    list.style.setProperty("--line-top", `${first}px`);
    list.style.setProperty("--line-height", `${Math.max(0, last - first)}px`);
}

/* Calcula los tiempos de la salida inversa: entrada al reves, escalada por MOTION.exitScale. */
function exitTimings(count) {
    const steps = Math.max(0, count - 1);
    const scale = MOTION.exitScale;
    const labelOut = MOTION.labelIn * scale;
    const labelOutStagger = MOTION.labelStagger * scale;
    const dotOut = MOTION.dotPop * scale;
    const dotOutStagger = MOTION.dotStagger * scale;
    const dotsOutAt = steps * labelOutStagger + labelOut;
    const lineOut = steps * dotOutStagger + dotOut;
    return {
        labelOut,
        labelOutStagger,
        dotOut,
        dotOutStagger,
        dotsOutAt,
        lineOut,
        total: Math.ceil(dotsOutAt + lineOut),
    };
}

/* Timeline de navegacion: dots con pop elastico, linea que crece y textos escalonados. */
export default function Timeline({
    items,
    revealed,
    covered,
    label,
    onSelect,
    variant = "workspace",
    exit = "fade",
    activeId = null,
}) {
    const reducedMotion = usePrefersReducedMotion();
    const visible = revealed && !covered;

    /* Cuenta cada vez que el timeline vuelve a ser visible para remontar la lista y reiniciar animaciones. */
    /* Al dejar de ser visible por revealed (sin tapar) y con exit="reverse", entra en salida inversa. */
    const [play, setPlay] = useState({ visible, id: 0, exiting: false });
    if (play.visible !== visible) {
        const reverseExit = !visible && exit === "reverse" && !reducedMotion && !covered;
        setPlay({ visible, id: visible ? play.id + 1 : play.id, exiting: reverseExit });
    }

    const exiting = play.exiting && !visible;
    const playId = play.id;
    const timings = exitTimings(items.length);
    const exitTotal = timings.total;

    /* Termina la salida inversa cuando acaba el ultimo elemento; si vuelve a mostrarse antes, el cleanup la corta. */
    useEffect(() => {
        if (!exiting) {
            return undefined;
        }
        const timer = window.setTimeout(() => {
            setPlay((prev) => (prev.exiting && prev.id === playId ? { ...prev, exiting: false } : prev));
        }, exitTotal);
        return () => window.clearTimeout(timer);
    }, [exiting, playId, exitTotal]);

    /* Observa la lista para recolocar la linea cuando cambia su tamano (fuentes, idioma, resize). */
    const listRef = useCallback((list) => {
        if (!list) {
            return undefined;
        }
        fitLine(list);
        const observer = new ResizeObserver(() => fitLine(list));
        observer.observe(list);
        return () => observer.disconnect();
    }, []);

    const dotsDone = Math.max(0, items.length - 1) * MOTION.dotStagger + MOTION.dotPop;

    const style = {
        "--n": items.length,
        "--dot-pop": `${MOTION.dotPop}ms`,
        "--dot-stagger": `${MOTION.dotStagger}ms`,
        "--line-dur": `${dotsDone}ms`,
        "--labels-at": `${dotsDone}ms`,
        "--label-in": `${MOTION.labelIn}ms`,
        "--label-stagger": `${MOTION.labelStagger}ms`,
        "--ease-out": EASING.out,
        "--ease-drop": EASING.abrupt,
        "--impact-at": `${IMPACT_MS}ms`,
        "--drop-fall": `${IMPACT_MS}ms`,
        "--dot-ripple": `${MOTION.dotRipple}ms`,
        "--ripple-gap": `${RIPPLE_GAP_MS}ms`,
        "--hide-fade": `${HIDE_FADE_MS}ms`,
        "--hover-dur": `${HOVER_MS}ms`,
        "--label-out": `${timings.labelOut}ms`,
        "--label-out-stagger": `${timings.labelOutStagger}ms`,
        "--dot-out": `${timings.dotOut}ms`,
        "--dot-out-stagger": `${timings.dotOutStagger}ms`,
        "--dots-out-at": `${timings.dotsOutAt}ms`,
        "--line-out": `${timings.lineOut}ms`,
    };

    const classes = [
        "tl-root",
        variant === "strip" ? "tl-root--strip" : "",
        exit === "reverse" ? "tl-root--reverse" : "",
        revealed || exiting ? "" : "is-hidden",
        covered ? "is-covered" : "",
        visible ? "is-visible" : "",
        visible && !reducedMotion ? "is-playing" : "",
        exiting ? "is-exiting" : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={classes} style={style} inert={!visible}>
            <nav className="tl-nav" aria-label={label}>
                <ol key={play.id} ref={listRef} className="tl-list">
                    {items.map((item, index) => (
                        <TimelineItem
                            key={item.id}
                            item={item}
                            index={index}
                            active={activeId !== null && item.id === activeId}
                            glitch={visible && !exiting}
                            onSelect={onSelect}
                        />
                    ))}
                </ol>
            </nav>
        </div>
    );
}

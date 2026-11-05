import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { MOTION } from "../config/motion.js";
import { PROJECTS, SECTIONS_COPY } from "../content/sections.js";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion.js";
import ProjectDot from "./projects/ProjectDot.jsx";
import ProjectSlide from "./projects/ProjectSlide.jsx";
import "./sections.css";
import "./projects/projects.css";

/* Duracion (ms) del fade de salida del proyecto que se va, antes de que entre el siguiente. */
const LEAVE_MS = 200;
/* Espacio (px) que queda libre entre la flecha "siguiente" y el borde inferior de la pantalla. */
const RAIL_BOTTOM_SPACE = 28;
/* Separacion minima (px) entre dots, para pantallas muy bajas. */
const RAIL_MIN_GAP = 48;
/* Rueda: tiempo minimo entre cambios (ms) y pausa sin eventos (ms) para considerar terminado un gesto
   (asi la inercia de un trackpad no salta varios proyectos de una). */
const WHEEL_COOLDOWN = 650;
const WHEEL_GESTURE_GAP = 180;
/* Movimiento minimo (px) de un swipe tactil para cambiar de proyecto. */
const SWIPE_MIN = 50;
/* Teclas de paso, las mismas que usa la cadena de secciones: un proyecto por pulsacion. */
const KEYS_NEXT = ["ArrowDown", "PageDown", " "];
const KEYS_PREV = ["ArrowUp", "PageUp"];

/* Arma el texto del periodo: "2021", "2021 - 2022" o "2021 - Actualidad". */
function formatPeriod(period, presentLabel) {
    if (!period) {
        return "";
    }
    if (period.current) {
        return `${period.start} - ${presentLabel}`;
    }
    if (period.end && period.end !== period.start) {
        return `${period.start} - ${period.end}`;
    }
    return String(period.start);
}

/* Primer ancestro con scroll vertical propio (el panel de la seccion). */
function findScrollParent(element) {
    let node = element?.parentElement;
    while (node && node !== document.body) {
        const overflow = getComputedStyle(node).overflowY;
        if (overflow === "auto" || overflow === "scroll") {
            return node;
        }
        node = node.parentElement;
    }
    return null;
}

/* Direccion de un paso segun la tecla: 1 abajo, -1 arriba, 0 si no es una tecla de paso. */
function keyDirection(key) {
    if (KEYS_NEXT.includes(key)) {
        return 1;
    }
    return KEYS_PREV.includes(key) ? -1 : 0;
}

/* Deja la tecla a quien la tiene: campos de texto y la barra espaciadora de botones y enlaces (flechas, dots,
   links de los proyectos). Mismo criterio que useSectionChainScroll. */
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

/* Flecha de la timeline (la de arriba es la misma girada). */
function ArrowButton({ direction, label, disabled, onClick }) {
    return (
        <button
            type="button"
            className={`prj-arrow prj-arrow--${direction}`}
            onClick={onClick}
            /* Contrato con useSectionChainScroll: mientras esta flecha siga habilitada, la cadena de secciones le
               cede el gesto en ese borde. Va en el mismo boton que lleva disabled, que es lo que mira el guardia. */
            data-chain-hold={direction}
            disabled={disabled}
            aria-label={label}
            title={label}
        >
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path
                    d="M12 5v14m0 0-6-6m6 6 6-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </button>
    );
}

/* Seccion Proyectos: un proyecto por vez. A la izquierda, una timeline negra con un dot por proyecto (todos
   visibles); se avanza o retrocede con las flechas, la rueda, el swipe o tocando un dot. */
export default function Proyectos({ language }) {
    const copy = SECTIONS_COPY[language].projects;
    const reduced = usePrefersReducedMotion();
    const textById = new Map(copy.items.map((item) => [item.id, item]));
    const projects = PROJECTS.filter((project) => textById.has(project.id));
    const lastIndex = projects.length - 1;

    const [activeIndex, setActiveIndex] = useState(0);
    const [leavingIndex, setLeavingIndex] = useState(null);
    const timerRef = useRef(0);
    const stageRef = useRef(null);

    /* Limpia el timer del cambio de proyecto al desmontar. */
    useEffect(() => () => clearTimeout(timerRef.current), []);

    /* Estira la timeline para que, con la flecha debajo, llegue casi al final de la pantalla. Se recalcula cuando
       cambia el alto de lo que hay arriba (el texto se escribe al entrar, cambia el idioma) o el de la ventana. */
    useLayoutEffect(() => {
        const stage = stageRef.current;
        const track = stage?.querySelector(".prj-rail-track");
        if (!stage || !track) {
            return undefined;
        }

        const panel = findScrollParent(stage);

        const fit = () => {
            const next = stage.querySelector(".prj-arrow--down");
            const railGap = parseFloat(getComputedStyle(track.parentElement).rowGap) || 0;
            const reserve = (next ? next.offsetHeight + railGap : 0) + RAIL_BOTTOM_SPACE;
            const available = window.innerHeight - track.getBoundingClientRect().top - reserve;
            const minimum = Math.max(1, projects.length - 1) * RAIL_MIN_GAP;
            let height = Math.round(Math.max(minimum, available));
            stage.style.setProperty("--prj-track-h", `${height}px`);

            /* Si la timeline es lo que hace scrolleable al panel, se achica justo lo que sobra: con un proyecto que
               entra en pantalla, la rueda tiene que cambiar de proyecto en el primer gesto. */
            const overflow = panel ? panel.scrollHeight - panel.clientHeight : 0;
            if (overflow > 0) {
                const rail = track.parentElement.getBoundingClientRect().bottom;
                const slides = stage.querySelector(".prj-slides")?.getBoundingClientRect().bottom ?? rail;
                const excess = Math.min(overflow, Math.ceil(rail - slides));
                if (excess > 0) {
                    height = Math.max(minimum, height - excess);
                    stage.style.setProperty("--prj-track-h", `${height}px`);
                }
            }
        };

        fit();
        const observer = new ResizeObserver(fit);
        observer.observe(stage.parentElement ?? stage);
        window.addEventListener("resize", fit);
        return () => {
            observer.disconnect();
            window.removeEventListener("resize", fit);
        };
    }, [projects.length]);

    /* Cambia de proyecto: el actual sale con un fade corto y despues entra el nuevo.
       El panel vuelve arriba para que el proyecto nuevo se vea completo. Devuelve false si no pudo cambiar. */
    const goTo = useCallback(
        (index) => {
            if (index < 0 || index > lastIndex || index === activeIndex || leavingIndex !== null) {
                return false;
            }
            const show = () => {
                setLeavingIndex(null);
                setActiveIndex(index);
                findScrollParent(stageRef.current)?.scrollTo({ top: 0 });
            };
            if (reduced) {
                show();
                return true;
            }
            setLeavingIndex(activeIndex);
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(show, LEAVE_MS);
            return true;
        },
        [activeIndex, lastIndex, leavingIndex, reduced]
    );

    /* La rueda, el swipe y el teclado leen la ultima version de goTo sin volver a registrar listeners. */
    const goToRef = useRef(goTo);
    const activeRef = useRef(activeIndex);
    useLayoutEffect(() => {
        goToRef.current = goTo;
        activeRef.current = activeIndex;
    }, [goTo, activeIndex]);

    /* Rueda, swipe y las teclas de paso pasan al proyecto anterior/siguiente. Si el proyecto es mas alto que la
       pantalla, primero se scrollea el panel y recien en el borde (arriba o abajo) se cambia de proyecto. */
    useEffect(() => {
        const panel = findScrollParent(stageRef.current);
        if (!panel) {
            return undefined;
        }

        const atEdge = (direction) =>
            direction > 0
                ? panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 2
                : panel.scrollTop <= 1;

        const step = (direction) => goToRef.current(activeRef.current + direction);

        let lockedUntil = 0;
        let lastWheel = 0;
        const onWheel = (event) => {
            const now = performance.now();
            const gestureContinues = now - lastWheel < WHEEL_GESTURE_GAP;
            lastWheel = now;
            if (Math.abs(event.deltaY) < 4 || now < lockedUntil || (gestureContinues && lockedUntil > 0)) {
                if (now >= lockedUntil && !gestureContinues) {
                    lockedUntil = 0;
                }
                return;
            }
            const direction = event.deltaY > 0 ? 1 : -1;
            if (atEdge(direction) && step(direction)) {
                lockedUntil = now + WHEEL_COOLDOWN;
            }
        };

        let touchStartY = null;
        const onTouchStart = (event) => {
            touchStartY = event.touches[0]?.clientY ?? null;
        };
        const onTouchEnd = (event) => {
            const endY = event.changedTouches[0]?.clientY;
            if (touchStartY === null || endY === undefined) {
                return;
            }
            const delta = touchStartY - endY;
            touchStartY = null;
            if (Math.abs(delta) < SWIPE_MIN) {
                return;
            }
            const direction = delta > 0 ? 1 : -1;
            if (atEdge(direction)) {
                step(direction);
            }
        };

        const onKeyDown = (event) => {
            /* Con modificadores la tecla es otra cosa (seleccion, atajos, shift + espacio): no es un paso. */
            if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
                return;
            }
            const direction = keyDirection(event.key);
            if (!direction || keyBelongsToTarget(event)) {
                return;
            }
            /* En los extremos step devuelve false y no se frena el evento: la cadena se lleva el gesto a la
               seccion anterior o siguiente. */
            if (atEdge(direction) && step(direction)) {
                event.preventDefault();
            }
        };

        panel.addEventListener("wheel", onWheel, { passive: true });
        panel.addEventListener("touchstart", onTouchStart, { passive: true });
        panel.addEventListener("touchend", onTouchEnd, { passive: true });
        panel.addEventListener("keydown", onKeyDown);
        return () => {
            panel.removeEventListener("wheel", onWheel);
            panel.removeEventListener("touchstart", onTouchStart);
            panel.removeEventListener("touchend", onTouchEnd);
            panel.removeEventListener("keydown", onKeyDown);
        };
    }, []);

    /* Cada slide sabe si esta entrando, saliendo u oculto; solo el activo (sin transicion) reproduce su video. */
    const stateOf = (index) => {
        if (index === leavingIndex) {
            return "leaving";
        }
        if (index === activeIndex && leavingIndex === null) {
            return "active";
        }
        return "hidden";
    };

    return (
        <article className="sec sec-proyectos">
            <header className="sec-header">
                <span className="sec-kicker">{copy.kicker}</span>
                <h2>{copy.title}</h2>
            </header>
            <p className="sec-text">{copy.intro}</p>

            <div
                ref={stageRef}
                className="prj-stage"
                style={{
                    "--prj-count": projects.length,
                    "--prj-drop": `${MOTION.dropInterval}ms`,
                }}
            >
                <nav className="prj-rail" aria-label={copy.timelineLabel}>
                    {projects.length > 1 && (
                        <ArrowButton
                            direction="up"
                            label={copy.prev}
                            disabled={activeIndex === 0}
                            onClick={() => goTo(activeIndex - 1)}
                        />
                    )}

                    <ol className="prj-rail-track">
                        {projects.map((project, index) => (
                            <li key={project.id} className="prj-rail-item" style={{ "--i": index }}>
                                <ProjectDot
                                    label={textById.get(project.id).title}
                                    active={index === activeIndex}
                                    onClick={() => goTo(index)}
                                />
                            </li>
                        ))}
                    </ol>

                    {projects.length > 1 && (
                        <ArrowButton
                            direction="down"
                            label={copy.next}
                            disabled={activeIndex === lastIndex}
                            onClick={() => goTo(activeIndex + 1)}
                        />
                    )}
                </nav>

                <div className="prj-slides">
                    {projects.map((project, index) => {
                        const state = stateOf(index);
                        return (
                            <ProjectSlide
                                key={project.id}
                                project={project}
                                text={textById.get(project.id)}
                                index={index}
                                period={formatPeriod(project.period, copy.present)}
                                badge={project.status === "development" ? copy.inDevelopment : null}
                                state={state}
                                playing={state === "active"}
                            />
                        );
                    })}
                </div>
            </div>
        </article>
    );
}

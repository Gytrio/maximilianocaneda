import { useEffect, useLayoutEffect, useRef } from "react";
import { MOTION, EASING } from "../../config/motion.js";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion.js";
import useTypewriter from "../../hooks/useTypewriter.js";
import "./SectionStage.css";

const WHITE_STATUSES = ["whiteout", "entering", "open", "closing"];
const PANEL_STATUSES = ["entering", "open", "closing"];

/* Calcula el diametro que cubre todo el contenedor desde el origen (con x negativo toma w - x como lado lejano). */
function coverDiameter(x, y, w, h) {
    return 2 * Math.ceil(Math.hypot(Math.max(x, w - x), Math.max(y, h - y))) + 4;
}

/* Calcula la escala inicial: el tamano del dot, o si el dot esta en la franja, la que toca el borde izquierdo. */
function startScale(x, size, d) {
    const startDiameter = x < 0 ? 2 * (Math.abs(x) + size / 2) : size;
    return Math.min(1, startDiameter / d);
}

/* Escenario de la seccion activa: circulo que crece, fundido a blanco y panel con el contenido. */
export default function SectionStage({
    status,
    activeId,
    displayId,
    switching = false,
    origin,
    dotSize,
    backLabel,
    onClose,
    children,
}) {
    const reduced = usePrefersReducedMotion();
    const stageRef = useRef(null);
    const circleRef = useRef(null);
    const panelRef = useRef(null);
    const contentRef = useRef(null);

    const shownId = displayId ?? activeId;
    const originX = origin?.x ?? 0;
    const originY = origin?.y ?? 0;
    const startSize = Math.max(1, dotSize ?? 1);

    /* Durante el crecimiento de un cambio el panel viejo queda visible, estatico y sin interaccion. */
    const stalePanel = switching && status === "expanding";
    const showCircle = !reduced && (status === "expanding" || status === "whiteout");
    const showWhite = stalePanel || WHITE_STATUSES.includes(status);
    const showPanel = stalePanel || PANEL_STATUSES.includes(status);

    useTypewriter(contentRef, { run: status === "entering" || status === "open", runKey: shownId });

    /* Dimensiona el circulo al tamano final y lo anima desde el tamano del dot. */
    useLayoutEffect(() => {
        if (status !== "expanding" || reduced) {
            return undefined;
        }
        const stage = stageRef.current;
        const circle = circleRef.current;
        if (!stage || !circle || typeof circle.animate !== "function") {
            return undefined;
        }

        const d = coverDiameter(originX, originY, stage.clientWidth, stage.clientHeight);
        circle.style.width = d + "px";
        circle.style.height = d + "px";
        circle.style.left = originX - d / 2 + "px";
        circle.style.top = originY - d / 2 + "px";

        const animation = circle.animate(
            [{ transform: `scale(${startScale(originX, startSize, d)})` }, { transform: "scale(1)" }],
            { duration: MOTION.expand, easing: EASING.abrupt, fill: "forwards" }
        );
        return () => animation.cancel();
    }, [status, activeId, originX, originY, startSize, reduced]);

    /* Funde el circulo a transparente sobre la capa blanca. */
    useLayoutEffect(() => {
        if (status !== "whiteout" || reduced) {
            return undefined;
        }
        const circle = circleRef.current;
        if (!circle || typeof circle.animate !== "function") {
            return undefined;
        }

        const animation = circle.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: MOTION.whiteout,
            easing: "linear",
            fill: "forwards",
        });
        return () => animation.cancel();
    }, [status, activeId, reduced]);

    /* Enfoca el panel al quedar abierto (tambien tras un cambio) para que el teclado y lectores arranquen ahi. */
    useEffect(() => {
        if (status === "open") {
            panelRef.current?.focus({ preventScroll: true });
        }
    }, [status, shownId]);

    /* Cierra la seccion con Escape mientras esta abierta. */
    useEffect(() => {
        if (status !== "open") {
            return undefined;
        }
        const onKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose?.();
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [status, onClose]);

    const stageStyle = {
        "--stage-in": MOTION.contentIn + "ms",
        "--stage-out": MOTION.closing + "ms",
        "--stage-ease-out": EASING.out,
    };

    return (
        <div
            ref={stageRef}
            className={"section-stage" + (reduced ? " is-reduced" : "")}
            data-status={status}
            data-switching={switching ? "true" : undefined}
            style={stageStyle}
        >
            {showWhite && <div className="stage-white" aria-hidden="true" />}
            {showPanel && (
                <section
                    key={shownId}
                    ref={panelRef}
                    className={"stage-panel" + (stalePanel ? " is-stale" : "")}
                    tabIndex={-1}
                    inert={stalePanel}
                    aria-hidden={stalePanel ? "true" : undefined}
                >
                    <div className="stage-inner">
                        <button type="button" className="stage-back" onClick={onClose}>
                            <span className="stage-back-arrow" aria-hidden="true">←</span>
                            {backLabel}
                        </button>
                        <div ref={contentRef} className="stage-content">
                            {children}
                        </div>
                    </div>
                </section>
            )}
            {showCircle && <div ref={circleRef} className="stage-circle" aria-hidden="true" />}
        </div>
    );
}

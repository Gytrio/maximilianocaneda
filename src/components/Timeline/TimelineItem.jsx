import { useRef } from "react";
import useRandomGlitch from "../../hooks/useRandomGlitch.js";
import "../../styles/dotGlitch.css";

/* Glitch de los dots del timeline: mas espaciado que el del proyecto activo, porque son varios dots a la vez y
   cada uno lleva su propio ritmo al azar. */
const TIMELINE_GLITCH = { wait: [1400, 5200], length: [110, 240] };

/* Item del timeline: un unico boton que contiene el dot y el texto. */
export default function TimelineItem({ item, index, active = false, glitch = false, onSelect }) {
    const dotRef = useRef(null);
    const buttonRef = useRef(null);
    useRandomGlitch(buttonRef, { enabled: glitch, ...TIMELINE_GLITCH });

    /* Avisa la seleccion pasando el circulo visible para que la transicion parta desde el. */
    const handleClick = () => {
        onSelect?.(item.id, dotRef.current);
    };

    return (
        <li className="tl-item" style={{ "--i": index }}>
            <button
                ref={buttonRef}
                type="button"
                className="tl-button"
                data-timeline-id={item.id}
                aria-current={active ? "page" : undefined}
                onClick={
                    item.interactive
                        ? handleClick
                        : () => {
                              /* Item sin seccion: por ahora no hace nada. */
                          }
                }
            >
                <span className="tl-dot" aria-hidden="true">
                    {/* Ola circular (dos anillos en ::before y ::after) que se abre detras del dot al impacto. */}
                    <span className="tl-dot-ripple" />
                    {/* Cuerpo del dot: recibe el glitch al azar sin pisar el pop del nucleo. */}
                    <span className="tl-dot-body dot-glitch">
                        <span ref={dotRef} className="tl-dot-core" />
                    </span>
                    {/* Gota que cae sobre el dot justo antes del impacto. */}
                    <span className="tl-dot-drop" />
                </span>
                <span className="tl-label">{item.label}</span>
            </button>
        </li>
    );
}

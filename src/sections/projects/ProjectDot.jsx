import { useRef } from "react";
import useRandomGlitch from "../../hooks/useRandomGlitch.js";
import "../../styles/dotGlitch.css";

/* Dot de la timeline de proyectos. El activo emite ondas de goteo constantes y, cada tanto y al azar, hace un
   glitch corto (dot y, mas leve, sus ondas). */
export default function ProjectDot({ label, active, onClick }) {
    const dotRef = useRef(null);
    useRandomGlitch(dotRef, { enabled: active });

    return (
        <button
            ref={dotRef}
            type="button"
            className={`prj-dot${active ? " is-active" : ""}`}
            aria-label={label}
            aria-current={active ? "step" : undefined}
            onClick={onClick}
        >
            <span className="prj-dot-waves" aria-hidden="true">
                <span className="prj-wave" />
                <span className="prj-wave" />
            </span>
            <span className="prj-dot-body dot-glitch" aria-hidden="true">
                <span className="prj-dot-core" />
            </span>
        </button>
    );
}

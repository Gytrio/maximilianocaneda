import { useLayoutEffect, useRef } from "react";
import { EASING, MOTION } from "../../config/motion.js";
import "./ThemeWipe.css";

/* Calcula el diametro que cubre todo el viewport desde el origen (toma el lado mas lejano en cada eje). */
function coverDiameter(x, y, w, h) {
    return 2 * Math.ceil(Math.hypot(Math.max(x, w - x), Math.max(y, h - y))) + 4;
}

/* Tapa del cambio de tema: circulo que nace en el boton, crece hasta cubrir la pantalla y despues se funde
   dejando ver el portfolio ya en el tema nuevo. Solo se monta mientras dura el wipe. */
export default function ThemeWipe({ wipe }) {
    const { x, y, size, to, phase } = wipe;
    const layerRef = useRef(null);
    const circleRef = useRef(null);

    /* Dimensiona el circulo al tamano final y lo anima desde el tamano del boton. Corre una sola vez al montar:
       si volviera a correr en la fase de fundido, revertiria el transform y destaparia la pantalla a mitad. */
    useLayoutEffect(() => {
        const layer = layerRef.current;
        const circle = circleRef.current;
        if (!layer || !circle || typeof circle.animate !== "function") {
            return undefined;
        }

        const d = coverDiameter(x, y, layer.clientWidth, layer.clientHeight);
        circle.style.width = d + "px";
        circle.style.height = d + "px";
        circle.style.left = x - d / 2 + "px";
        circle.style.top = y - d / 2 + "px";

        const start = Math.min(1, Math.max(1, size) / d);
        const animation = circle.animate(
            [{ transform: `scale(${start})` }, { transform: "scale(1)" }],
            { duration: MOTION.themeWipe, easing: EASING.abrupt, fill: "forwards" }
        );
        return () => animation.cancel();
    }, [x, y, size]);

    /* Con el tema ya cambiado detras, funde el circulo a transparente; no toca la animacion de escala. */
    useLayoutEffect(() => {
        if (phase !== "fading") {
            return undefined;
        }
        const circle = circleRef.current;
        if (!circle || typeof circle.animate !== "function") {
            return undefined;
        }

        const animation = circle.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: MOTION.themeFade,
            easing: "linear",
            fill: "forwards",
        });
        return () => animation.cancel();
    }, [phase]);

    return (
        <div ref={layerRef} className="theme-wipe" data-to={to} aria-hidden="true">
            <div ref={circleRef} className="theme-wipe__circle" />
        </div>
    );
}

import { useEffect, useState } from "react";
import { MOTION } from "../../config/motion";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";
import "./glitchLayers.css";
import "./StripGlitch.css";

/* Arma las dos capas compartidas del glitch (fisuras blancas y trama roja). */
function GlitchLayers() {
    return (
        <>
            <div className="glitch-cracks" />
            <div className="glitch-pixels" />
        </>
    );
}

/* Numero al azar entre min y max. */
const between = ([min, max]) => min + Math.random() * (max - min);

/* Glitch de la franja: se reproduce completo cada vez que la fase pasa de "hero" a "split" y, mientras la
   identidad esta en la franja, lanza rafagas espontaneas con espera y duracion al azar. */
export default function StripGlitch({ phase }) {
    const reducedMotion = usePrefersReducedMotion();
    const [prevPhase, setPrevPhase] = useState(phase);
    const [run, setRun] = useState({ id: 0, duration: MOTION.stripGlitch });
    const [endedRunId, setEndedRunId] = useState(0);

    /* Detecta la llegada a la franja durante el render (no dispara si la pagina ya carga en "split"). */
    if (phase !== prevPhase) {
        setPrevPhase(phase);
        if (prevPhase === "hero" && phase === "split" && !reducedMotion) {
            setRun((current) => ({ id: current.id + 1, duration: MOTION.stripGlitch }));
        }
    }

    const playing = run.id !== endedRunId && !reducedMotion;

    /* Termina la reproduccion al cumplirse su duracion; si llega otra, reinicia el timer. */
    useEffect(() => {
        if (run.id === endedRunId) {
            return undefined;
        }
        const timer = window.setTimeout(() => setEndedRunId(run.id), run.duration);
        return () => window.clearTimeout(timer);
    }, [run, endedRunId]);

    /* En la franja y sin glitch en curso, programa la proxima rafaga espontanea con espera y duracion al azar. */
    useEffect(() => {
        if (phase !== "split" || reducedMotion || playing) {
            return undefined;
        }
        const timer = window.setTimeout(() => {
            const duration = Math.round(MOTION.stripGlitch * between(MOTION.stripBurstScale));
            setRun((current) => ({ id: current.id + 1, duration }));
        }, between(MOTION.stripBurstWait));
        return () => window.clearTimeout(timer);
    }, [phase, reducedMotion, playing]);

    return (
        <div
            className="strip-glitch"
            aria-hidden="true"
            style={{ "--glitch-dur": `${run.duration}ms` }}
        >
            {playing && (
                <div key={run.id} className="strip-glitch__run">
                    <div className="strip-glitch__sweep">
                        <GlitchLayers />
                    </div>
                    <div className="strip-glitch__trail strip-glitch__trail--a">
                        <GlitchLayers />
                    </div>
                    <div className="strip-glitch__trail strip-glitch__trail--b">
                        <GlitchLayers />
                    </div>
                    <div className="strip-glitch__trail strip-glitch__trail--c">
                        <GlitchLayers />
                    </div>
                </div>
            )}
        </div>
    );
}

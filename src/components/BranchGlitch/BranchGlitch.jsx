import { useEffect, useMemo, useState } from "react";
import { MOTION } from "../../config/motion";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";
import "../StripGlitch/glitchLayers.css";
import "./BranchGlitch.css";

/* Cuanto pueden salir las ramas fuera de la caja (en unidades del viewBox 0..100). */
const REACH = 45;
/* Paso de tiempo (fraccion de MOTION.branchGlitch) entre tramos de una misma rama. */
const SEG_STEP = 0.075;

/* Devuelve un PRNG determinista (mulberry32) a partir de una semilla entera. */
function createRandom(seed) {
    let state = (seed * 2654435761) >>> 0;
    return () => {
        state = (state + 0x6d2b79f5) >>> 0;
        let t = state;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/* Devuelve un numero al azar entre min y max. */
function between(rand, min, max) {
    return min + rand() * (max - min);
}

/* Redondea a 2 decimales para que el atributo d quede corto. */
function round(value) {
    return Math.round(value * 100) / 100;
}

/* Devuelve el punto de nacimiento y el rumbo hacia afuera de un anclaje (4 esquinas y 4 bordes). */
function anchorFor(slot, rand) {
    const inset = between(rand, 0, 3);
    if (slot < 4) {
        const right = slot === 1 || slot === 2;
        const bottom = slot >= 2;
        const x = right ? 100 - inset : inset;
        const y = bottom ? 100 - inset : inset;
        const heading = Math.atan2(bottom ? 1 : -1, right ? 1 : -1) + between(rand, -0.35, 0.35);
        return { x, y, heading };
    }
    const along = between(rand, 15, 85);
    if (slot === 4) {
        return { x: along, y: inset, heading: -Math.PI / 2 };
    }
    if (slot === 5) {
        return { x: 100 - inset, y: along, heading: 0 };
    }
    if (slot === 6) {
        return { x: along, y: 100 - inset, heading: Math.PI / 2 };
    }
    return { x: inset, y: along, heading: Math.PI };
}

/* Indica si un punto ya salio del alcance permitido alrededor de la caja. */
function outOfReach(point) {
    return point.x < -REACH || point.x > 100 + REACH || point.y < -REACH || point.y > 100 + REACH;
}

/* Recorre una linea quebrada desde un punto, alternando el angulo en cada tramo. */
function walk(rand, start, baseHeading, count, minLen, maxLen, minTurn, maxTurn) {
    const points = [start];
    const headings = [];
    let sign = rand() < 0.5 ? -1 : 1;
    for (let i = 0; i < count; i += 1) {
        const heading = baseHeading + sign * between(rand, minTurn, maxTurn);
        const len = between(rand, minLen, maxLen);
        const prev = points[points.length - 1];
        const next = {
            x: Math.min(100 + REACH, Math.max(-REACH, prev.x + Math.cos(heading) * len)),
            y: Math.min(100 + REACH, Math.max(-REACH, prev.y + Math.sin(heading) * len)),
        };
        points.push(next);
        headings.push(heading);
        sign = -sign;
        if (outOfReach({ x: prev.x + Math.cos(heading) * len, y: prev.y + Math.sin(heading) * len })) {
            break;
        }
    }
    return { points, headings };
}

/* Convierte una linea quebrada en tramos sueltos con su momento de aparicion. */
function toSegments(points, startAt, step) {
    const segments = [];
    for (let i = 1; i < points.length; i += 1) {
        const a = points[i - 1];
        const b = points[i];
        segments.push({
            d: `M${round(a.x)} ${round(a.y)}L${round(b.x)} ${round(b.y)}`,
            at: round(startAt + (i - 1) * step),
        });
    }
    return segments;
}

/* Genera la geometria completa de una reproduccion: ramas, subramas, destellos rojos y bloques de fisuras. */
function buildGlitch(seed) {
    const rand = createRandom(seed);
    const slots = [0, 1, 2, 3, 4, 5, 6, 7];
    for (let i = slots.length - 1; i > 0; i -= 1) {
        const j = Math.floor(rand() * (i + 1));
        [slots[i], slots[j]] = [slots[j], slots[i]];
    }

    const count = 4 + Math.floor(rand() * 3);
    const branches = [];
    const vertices = [];
    const tips = [];

    for (let b = 0; b < count; b += 1) {
        const anchor = anchorFor(slots[b], rand);
        const startAt = 0.02 + b * 0.015;
        const main = walk(rand, { x: anchor.x, y: anchor.y }, anchor.heading, 3 + Math.floor(rand() * 3), 7, 12, 0.2, 0.7);
        const segments = toSegments(main.points, startAt, SEG_STEP);

        /* Agrega 1 a 3 subramas que nacen de vertices intermedios de la rama principal. */
        const subCount = 1 + Math.floor(rand() * 3);
        const lastInner = Math.max(1, main.points.length - 2);
        for (let s = 0; s < subCount; s += 1) {
            const k = 1 + Math.floor(rand() * lastInner);
            const origin = main.points[Math.min(k, main.points.length - 1)];
            const parentHeading = main.headings[Math.min(k, main.headings.length - 1)];
            const side = rand() < 0.5 ? -1 : 1;
            const sub = walk(rand, origin, parentHeading + side * between(rand, 0.6, 1.1), 1 + Math.floor(rand() * 3), 4, 8, 0.15, 0.5);
            segments.push(...toSegments(sub.points, startAt + k * SEG_STEP + 0.04, 0.06));
        }

        main.points.slice(1).forEach((point, i) => {
            vertices.push({ ...point, at: startAt + (i + 1) * SEG_STEP });
        });
        const tip = main.points[main.points.length - 1];
        tips.push({ ...tip, at: startAt + (main.points.length - 1) * SEG_STEP });
        branches.push({ id: b, phase: round(rand()), segments });
    }

    /* Elige 2 a 4 vertices de las ramas para los destellos de la trama roja. */
    const flashes = [];
    const flashCount = 2 + Math.floor(rand() * 3);
    for (let f = 0; f < flashCount && vertices.length > 0; f += 1) {
        const index = Math.floor(rand() * vertices.length);
        const [vertex] = vertices.splice(index, 1);
        flashes.push({ id: f, x: round(vertex.x), y: round(vertex.y), at: round(vertex.at + 0.03), phase: round(rand()) });
    }

    /* Elige 2 puntas de rama para los bloques de fisuras blancas. */
    const cracks = [];
    for (let c = 0; c < 2 && tips.length > 0; c += 1) {
        const index = Math.floor(rand() * tips.length);
        const [tip] = tips.splice(index, 1);
        cracks.push({ id: c, x: round(tip.x), y: round(tip.y), at: round(tip.at) });
    }

    return { branches, flashes, cracks };
}

/* Reproduce una vez el glitch de ramificacion alrededor de la foto por cada incremento de runKey. */
export default function BranchGlitch({ runKey = 0 }) {
    const reducedMotion = usePrefersReducedMotion();
    const [endedKey, setEndedKey] = useState(0);

    /* Con reduced motion da por terminada la reproduccion pedida para que no se dispare despues. */
    if (reducedMotion && runKey !== endedKey) {
        setEndedKey(runKey);
    }

    const playing = runKey > 0 && runKey !== endedKey && !reducedMotion;
    const glitch = useMemo(() => (runKey > 0 ? buildGlitch(runKey) : null), [runKey]);

    /* Desmonta el efecto al cumplirse MOTION.branchGlitch; un nuevo runKey reinicia el timer. */
    useEffect(() => {
        if (!playing) {
            return undefined;
        }
        const timer = window.setTimeout(() => setEndedKey(runKey), MOTION.branchGlitch);
        return () => window.clearTimeout(timer);
    }, [playing, runKey]);

    if (!playing || !glitch) {
        return null;
    }

    return (
        <div
            key={runKey}
            className="branch-glitch"
            aria-hidden="true"
            style={{ "--glitch-dur": `${MOTION.branchGlitch}ms` }}
        >
            <svg className="branch-glitch__svg" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
                {glitch.branches.map((branch) => (
                    <g key={branch.id} className="branch-glitch__branch" style={{ "--phase": branch.phase }}>
                        {branch.segments.map((segment, i) => (
                            <path
                                key={i}
                                className="branch-glitch__seg"
                                d={segment.d}
                                vectorEffect="non-scaling-stroke"
                                style={{ "--at": segment.at }}
                            />
                        ))}
                    </g>
                ))}
            </svg>
            {glitch.cracks.map((crack) => (
                <div
                    key={`c${crack.id}`}
                    className="branch-glitch__spot branch-glitch__spot--cracks"
                    style={{ "--x": crack.x, "--y": crack.y, "--at": crack.at }}
                >
                    <div className="glitch-cracks" />
                </div>
            ))}
            {glitch.flashes.map((flash) => (
                <div
                    key={`f${flash.id}`}
                    className="branch-glitch__spot branch-glitch__spot--pixels"
                    style={{ "--x": flash.x, "--y": flash.y, "--at": flash.at, "--phase": flash.phase }}
                >
                    <div className="glitch-pixels" />
                </div>
            ))}
        </div>
    );
}

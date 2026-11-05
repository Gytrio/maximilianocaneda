import { useCallback, useEffect, useLayoutEffect, useReducer, useRef } from "react";
import { MOTION } from "../config/motion";
import usePrefersReducedMotion from "./usePrefersReducedMotion";

const INITIAL = { status: "idle", activeId: null, fromId: null, switching: false, origin: null, dotSize: null };

/* Estados con duracion propia y el estado al que avanzan cuando vence su timer. */
const STEPS = {
    expanding: { duration: MOTION.expand, next: "whiteout" },
    whiteout: { duration: MOTION.whiteout, next: "entering" },
    entering: { duration: MOTION.contentIn, next: "open" },
    closing: { duration: MOTION.closing, next: "idle" },
};

/* Estados con la seccion ya en pantalla y su timeline clickeable: desde ahi otro item cambia de seccion y
   Escape cierra. El timeline de la franja aparece en entering, asi que ese click tiene que contar. */
const ON_SCREEN = ["entering", "open"];

/* Maquina de estados de la transicion entre timeline y seccion. */
function reducer(state, action) {
    switch (action.type) {
        case "open": {
            /* Desde idle es apertura normal; con la seccion en pantalla y otro id es cambio de seccion. */
            const isSwitch = ON_SCREEN.includes(state.status) && action.id !== state.activeId;
            if (state.status !== "idle" && !isSwitch) {
                return state;
            }
            return {
                status: action.instant ? "open" : "expanding",
                activeId: action.id,
                fromId: isSwitch && !action.instant ? state.activeId : null,
                switching: isSwitch && !action.instant,
                origin: action.origin,
                dotSize: action.dotSize,
            };
        }
        case "close":
            if (!ON_SCREEN.includes(state.status)) {
                return state;
            }
            /* Cerrar a mitad de un cambio lo cancela: switching no sobrevive al closing. */
            return action.instant ? INITIAL : { ...state, status: "closing", fromId: null, switching: false };
        case "advance": {
            const step = STEPS[state.status];
            if (!step || state.status !== action.from) {
                return state;
            }
            if (step.next === "idle") {
                return INITIAL;
            }
            /* Al llegar a open el cambio termina y se olvida el id anterior. */
            if (step.next === "open") {
                return { ...state, status: "open", fromId: null, switching: false };
            }
            return { ...state, status: step.next };
        }
        default:
            return state;
    }
}

/* Orquesta la apertura, el cambio y el cierre de una seccion: expanding -> whiteout -> entering -> open -> closing -> idle. */
export default function useSectionTransition() {
    const reduced = usePrefersReducedMotion();
    const [state, dispatch] = useReducer(reducer, INITIAL);
    const statusRef = useRef(state.status);
    const activeIdRef = useRef(state.activeId);
    const reducedRef = useRef(reduced);
    const timerRef = useRef(0);

    /* Mantiene los refs alineados con el ultimo render confirmado. */
    useLayoutEffect(() => {
        statusRef.current = state.status;
        activeIdRef.current = state.activeId;
        reducedRef.current = reduced;
    }, [state.status, state.activeId, reduced]);

    /* Arranca el unico timer del paso actual; el cleanup lo cancela al encadenar o desmontar. */
    useEffect(() => {
        const step = STEPS[state.status];
        if (!step) {
            return undefined;
        }

        const from = state.status;
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            timerRef.current = 0;
            dispatch({ type: "advance", from });
        }, reduced ? 0 : step.duration);

        return () => {
            clearTimeout(timerRef.current);
            timerRef.current = 0;
        };
    }, [state.status, reduced]);

    /* Abre una seccion desde idle o cambia a otra con la seccion ya en pantalla; ignorado en cualquier otro caso. */
    const open = useCallback((id, { origin = null, dotSize = null } = {}) => {
        const isSwitch = ON_SCREEN.includes(statusRef.current) && id !== activeIdRef.current;
        if (statusRef.current !== "idle" && !isSwitch) {
            return;
        }
        const instant = reducedRef.current;
        statusRef.current = instant ? "open" : "expanding";
        activeIdRef.current = id;
        dispatch({ type: "open", id, origin, dotSize, instant });
    }, []);

    /* Vuelve al timeline; solo valido con la seccion en pantalla. */
    const close = useCallback(() => {
        if (!ON_SCREEN.includes(statusRef.current)) {
            return;
        }
        const instant = reducedRef.current;
        statusRef.current = instant ? "idle" : "closing";
        dispatch({ type: "close", instant });
    }, []);

    /* Durante el expanding de un cambio se sigue pintando la seccion anterior. */
    const displayId = state.switching && state.status === "expanding" ? state.fromId : state.activeId;

    return {
        status: state.status,
        activeId: state.activeId,
        displayId,
        switching: state.switching,
        origin: state.origin,
        dotSize: state.dotSize,
        open,
        close,
    };
}

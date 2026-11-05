import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import IdentityPanel from "./components/IdentityPanel/IdentityPanel.jsx";
import Timeline from "./components/Timeline/Timeline.jsx";
import SectionStage from "./components/SectionStage/SectionStage.jsx";
import StripGlitch from "./components/StripGlitch/StripGlitch.jsx";
import useScrollPhase from "./hooks/useScrollPhase.js";
import useSectionTransition from "./hooks/useSectionTransition.js";
import { TIMELINE_SECTIONS, getSection } from "./sections/registry.js";
import { UI } from "./content/ui.js";

const STORAGE_KEY = "portfolio-language";

/* Lee el idioma guardado; localStorage puede fallar en modo privado. */
const readStoredLanguage = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored === "en" || stored === "es" ? stored : "";
    } catch {
        return "";
    }
};

export default function App() {
    const [language, setLanguage] = useState(readStoredLanguage);
    const activeLanguage = language || "es";
    const ui = UI[activeLanguage];

    const workspaceRef = useRef(null);
    const lastSelectedRef = useRef(null);

    const { phase, timelineRevealed } = useScrollPhase({ enabled: Boolean(language) });
    const { status, activeId, displayId, switching, origin, dotSize, open, close } = useSectionTransition();
    const sectionOpen = status !== "idle";
    /* El timeline blanco queda visible solo mientras el dot crece en una apertura desde el area blanca. */
    const workspaceCovered = sectionOpen && !(status === "expanding" && !switching);
    /* El timeline de la franja se muestra con una seccion en pantalla y durante un cambio entre secciones. */
    const stripRevealed = activeId !== null && (status === "entering" || status === "open" || switching);

    /* Guarda el idioma elegido para la proxima visita. */
    useEffect(() => {
        if (!language) {
            return;
        }

        try {
            localStorage.setItem(STORAGE_KEY, language);
        } catch {
            /* Sin persistencia: el idioma se vuelve a pedir en la proxima visita. */
        }
    }, [language]);

    /* Bloquea el scroll del documento con el modal de idioma o con una seccion abierta. */
    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle("is-scroll-locked", !language || sectionOpen);
        return () => root.classList.remove("is-scroll-locked");
    }, [language, sectionOpen]);

    /* Con una seccion abierta el scroll esta bloqueado: si cambia el tamano (p.ej. rotar el celular),
       se lo vuelve a fijar al final para que la identidad siga en la franja. */
    useEffect(() => {
        if (!sectionOpen) {
            return undefined;
        }

        const pinToEnd = () => {
            window.scrollTo({ top: document.documentElement.scrollHeight - window.innerHeight, behavior: "instant" });
        };
        window.addEventListener("resize", pinToEnd);
        return () => window.removeEventListener("resize", pinToEnd);
    }, [sectionOpen]);

    /* Al volver al timeline, devuelve el foco al item que abrio la seccion. */
    useEffect(() => {
        if (status !== "idle" || !lastSelectedRef.current) {
            return undefined;
        }

        const id = lastSelectedRef.current;
        lastSelectedRef.current = null;
        const frame = requestAnimationFrame(() => {
            workspaceRef.current?.querySelector(`[data-timeline-id="${id}"]`)?.focus({ preventScroll: true });
        });
        return () => cancelAnimationFrame(frame);
    }, [status]);

    const timelineItems = useMemo(
        () =>
            TIMELINE_SECTIONS.map(({ id, label, interactive }) => ({
                id,
                label: label[activeLanguage],
                interactive,
            })),
        [activeLanguage]
    );

    /* Pasa la posicion del dot clickeado a coordenadas del workspace y arranca la transicion. */
    const handleSelect = useCallback(
        (id, dotElement) => {
            const workspace = workspaceRef.current;
            if (!workspace || !dotElement) {
                return;
            }

            const area = workspace.getBoundingClientRect();
            const dot = dotElement.getBoundingClientRect();
            lastSelectedRef.current = id;
            open(id, {
                origin: {
                    x: dot.left + dot.width / 2 - area.left,
                    y: dot.top + dot.height / 2 - area.top,
                },
                dotSize: dot.width,
            });
        },
        [open]
    );

    const handleToggleLanguage = useCallback(() => {
        setLanguage((current) => (current === "en" ? "es" : "en"));
    }, []);

    const ActiveSection = getSection(displayId)?.Component ?? null;

    return (
        <>
            {!language && (
                <div className="language-modal" role="dialog" aria-modal="true" aria-label={ui.languageModal.title}>
                    <div className="language-card">
                        <h2>{ui.languageModal.title}</h2>
                        <p>{ui.languageModal.subtitle}</p>
                        <div className="language-actions">
                            <button type="button" onClick={() => setLanguage("es")}>
                                {ui.languageModal.spanish}
                            </button>
                            <button type="button" onClick={() => setLanguage("en")}>
                                {ui.languageModal.english}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <IdentityPanel
                language={activeLanguage}
                phase={phase}
                onToggleLanguage={handleToggleLanguage}
                slotActive={activeId !== null}
            >
                <Timeline
                    variant="strip"
                    exit="reverse"
                    items={timelineItems}
                    revealed={stripRevealed}
                    covered={false}
                    label={ui.timelineLabel}
                    activeId={activeId}
                    onSelect={handleSelect}
                />
            </IdentityPanel>
            <StripGlitch phase={phase} />

            <div className="workspace" ref={workspaceRef} data-phase={phase}>
                <Timeline
                    items={timelineItems}
                    revealed={timelineRevealed}
                    covered={workspaceCovered}
                    label={ui.timelineLabel}
                    onSelect={handleSelect}
                />
                <SectionStage
                    status={status}
                    activeId={activeId}
                    displayId={displayId}
                    switching={switching}
                    origin={origin}
                    dotSize={dotSize}
                    backLabel={ui.back}
                    onClose={close}
                >
                    {ActiveSection && <ActiveSection language={activeLanguage} />}
                </SectionStage>
            </div>

            {/* Recorrido de scroll que mueve el hero hacia la franja. */}
            <div className="scroll-runway" aria-hidden="true">
                <div className="scroll-stop" />
                <div className="scroll-stop" />
            </div>
        </>
    );
}

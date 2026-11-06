import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import fotoPerfil from "../../assets/profile/foto-perfil.jpg";
import { EASING, MOTION } from "../../config/motion";
import { UI } from "../../content/ui";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";
import BranchGlitch from "../BranchGlitch/BranchGlitch.jsx";
import RootGlitch from "../RootGlitch/RootGlitch.jsx";
import "./IdentityPanel.css";

/* Tiempo (ms) que el boton de correo muestra el estado "copiado". */
const COPIED_MS = 2200;

/* Rebote al llegar: sigue de largo hacia donde venia (izquierda y arriba), vuelve y se asienta. */
const BOUNCE_KEYFRAMES = [
    { translate: "0px 0px", offset: 0 },
    { translate: "-14px -8px", offset: 0.24 },
    { translate: "7px 4px", offset: 0.5 },
    { translate: "-3px -1.5px", offset: 0.72 },
    { translate: "1px 0.5px", offset: 0.88 },
    { translate: "0px 0px", offset: 1 },
];

/* Sacudida: va y ven horizontal muy leve, rapido y simetrico; se suma al rebote (composite add). */
const SHAKE_KEYFRAMES = [
    { translate: "0px 0px" },
    { translate: "-2px 0px" },
    { translate: "2px 0px" },
    { translate: "-1.5px 0px" },
    { translate: "1.5px 0px" },
    { translate: "-0.75px 0px" },
    { translate: "0.75px 0px" },
    { translate: "0px 0px" },
];

/* La sacudida arranca casi junto con el rebote (fraccion de su duracion), sin esperar a que se asiente. */
const SHAKE_DELAY_RATIO = 0.3;

/* Grados de inclinacion por cada px/ms de velocidad horizontal del recorrido. */
const TILT_GAIN = 3;
/* Resorte de la inclinacion (por ms): rigidez y amortiguacion bajas para que rebote un poco al frenar. */
const TILT_STIFFNESS = 0.0009;
const TILT_DAMPING = 0.022;
/* Paso fijo (ms) de la integracion del resorte: estable para esta rigidez y amortiguacion. */
const TILT_STEP = 8;

/* Progreso de scroll del documento entre 0 y 1 (misma cuenta que useScrollPhase). */
function readScrollProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
}

/* Variables de duracion para el CSS (goteo, hover y recorte de la foto), fijas durante toda la vida del componente.
   Las alturas medidas (--identity-h, --text-h, --contact-h) se escriben aparte con setProperty. */
const PANEL_STYLE = {
    "--drop-interval": `${MOTION.dropInterval}ms`,
    "--hover-scale": `${MOTION.hoverScale}ms`,
    "--hover-ease": EASING.out,
    "--slot-reserve": `${MOTION.slotReserve}ms`,
};

/* Copia un texto al portapapeles, con respaldo para navegadores sin Clipboard API. */
async function copyToClipboard(text) {
    const copyWithTextarea = () => {
        const helper = document.createElement("textarea");
        helper.value = text;
        helper.setAttribute("readonly", "");
        helper.style.position = "fixed";
        helper.style.top = "-1000px";
        helper.style.opacity = "0";
        document.body.appendChild(helper);
        helper.select();
        const copied = document.execCommand("copy");
        document.body.removeChild(helper);
        return copied;
    };

    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }
    } catch {
        /* La Clipboard API puede fallar en contexto no seguro: se usa el respaldo. */
    }

    try {
        return copyWithTextarea();
    } catch {
        return false;
    }
}

/* Capa de fondo fija: franja negra, identidad (foto, nombre, roles), slot del timeline de la franja, pista de scroll
   y pie de contacto. El movimiento hero->franja, el goteo, el hover y el recorte de la foto se resuelven en CSS a
   partir de --scroll-p y de alturas medidas; la sacudida de llegada usa Web Animations. React solo re-renderiza por
   idioma, fase, slot o click. */
export default function IdentityPanel({ language, phase, onToggleLanguage, theme = "light", onToggleTheme, slotActive = false, children }) {
    const copy = UI[language] ?? UI.es;
    const panelRef = useRef(null);
    const identityRef = useRef(null);
    const photoRef = useRef(null);
    const textRef = useRef(null);
    const branchRef = useRef(null);
    const contactRef = useRef(null);
    const previousPhaseRef = useRef(phase);
    const copiedTimerRef = useRef(null);
    const [emailCopied, setEmailCopied] = useState(false);
    const [branchRun, setBranchRun] = useState(0);
    const reducedMotion = usePrefersReducedMotion();
    const isSplit = phase === "split";

    /* Sacude foto y texto a la vez cuando la fase pasa de hero a split (nunca en el primer render). */
    useEffect(() => {
        const arrived = previousPhaseRef.current === "hero" && phase === "split";
        previousPhaseRef.current = phase;
        if (!arrived || reducedMotion) {
            return undefined;
        }

        /* Rebote y sacudida casi a la vez: la sacudida se suma al rebote en curso. */
        const animations = [photoRef.current, textRef.current, branchRef.current]
            .filter((element) => element && typeof element.animate === "function")
            .flatMap((element) => [
                element.animate(BOUNCE_KEYFRAMES, {
                    duration: MOTION.arrivalBounce,
                    easing: EASING.out,
                }),
                element.animate(SHAKE_KEYFRAMES, {
                    duration: MOTION.arrivalShake,
                    delay: MOTION.arrivalBounce * SHAKE_DELAY_RATIO,
                    easing: "linear",
                    composite: "add",
                }),
            ]);

        return () => animations.forEach((animation) => animation.cancel());
    }, [phase, reducedMotion]);

    /* Inclina foto y texto hacia donde viajan segun la velocidad del scroll, con un resorte que rebota al frenar.
       Escribe --tilt en la raiz solo mientras hay movimiento; en reposo el loop se apaga. */
    useEffect(() => {
        const root = panelRef.current;
        if (!root) {
            return undefined;
        }
        if (reducedMotion) {
            root.style.setProperty("--tilt", "0deg");
            return undefined;
        }

        let rafId = 0;
        let lastTime = 0;
        let lastP = readScrollProgress();
        let velocityX = 0;
        let angle = 0;
        let spin = 0;

        const step = (now) => {
            const dt = lastTime ? Math.min(48, now - lastTime) : 16;
            lastTime = now;

            /* Velocidad horizontal en px/ms: el recorrido total es (ancho - foto) / 2; negativa yendo a la izquierda. */
            const p = readScrollProgress();
            const travel = (window.innerWidth - (photoRef.current?.offsetWidth ?? 0)) / 2;
            const rawVelocity = (-travel * (p - lastP)) / dt;
            lastP = p;
            velocityX += (rawVelocity - velocityX) * 0.35;

            const target = Math.max(-MOTION.tiltMax, Math.min(MOTION.tiltMax, velocityX * TILT_GAIN));
            /* Integra el resorte en sub-pasos fijos: con un solo paso largo (cuadro lento, pestana en segundo plano)
               la integracion se vuelve inestable y el angulo se dispara. */
            for (let remaining = dt; remaining > 0; remaining -= TILT_STEP) {
                const h = Math.min(TILT_STEP, remaining);
                spin += (TILT_STIFFNESS * (target - angle) - TILT_DAMPING * spin) * h;
                angle += spin * h;
            }
            /* Tope de seguridad: nunca mas de una vez y media la inclinacion maxima. */
            if (!Number.isFinite(angle)) {
                angle = 0;
                spin = 0;
            }
            const limit = MOTION.tiltMax * 1.5;
            angle = Math.max(-limit, Math.min(limit, angle));

            const settled = Math.abs(angle) < 0.01 && Math.abs(spin) < 0.0005 && Math.abs(velocityX) < 0.001;
            if (settled) {
                angle = 0;
                spin = 0;
                velocityX = 0;
                lastTime = 0;
                rafId = 0;
                root.style.setProperty("--tilt", "0deg");
                return;
            }

            root.style.setProperty("--tilt", `${angle.toFixed(3)}deg`);
            rafId = requestAnimationFrame(step);
        };

        const wake = () => {
            if (!rafId) {
                rafId = requestAnimationFrame(step);
            }
        };

        window.addEventListener("scroll", wake, { passive: true });
        return () => {
            window.removeEventListener("scroll", wake);
            cancelAnimationFrame(rafId);
            root.style.setProperty("--tilt", "0deg");
        };
    }, [reducedMotion]);

    /* Dispara el glitch de ramificacion y lleva el scroll al final (igual que deslizar hacia abajo); solo en hero. */
    const activateIdentity = useCallback(() => {
        setBranchRun((run) => run + 1);
        window.scrollTo({
            top: document.documentElement.scrollHeight - window.innerHeight,
            behavior: reducedMotion ? "auto" : "smooth",
        });
    }, [reducedMotion]);

    /* Activa la identidad con Enter o Espacio cuando la foto tiene foco. */
    const handleIdentityKeyDown = useCallback((event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            activateIdentity();
        }
    }, [activateIdentity]);

    /* En hero la foto y el texto se comportan como boton; en split no tienen rol ni foco. */
    /* En split la foto conserva tabIndex -1 (enfocable pero fuera del orden de tabulacion): si perdiera la
       capacidad de foco mientras lo tiene, React la vuelve a enfocar al confirmar el render y ese focus()
       cancela el scroll suave del click, dejando la identidad a mitad de camino. */
    const identityAction = isSplit
        ? { tabIndex: -1 }
        : {
            role: "button",
            tabIndex: 0,
            "aria-label": copy.identityLabel,
            onClick: activateIdentity,
            onKeyDown: handleIdentityKeyDown,
        };

    /* El texto solo responde al click: el boton de teclado es la foto, asi el h1 sigue visible para lectores. */
    const textAction = isSplit ? {} : { onClick: activateIdentity };

    /* Mide el bloque de identidad, el texto y el pie, y publica sus alturas en la raiz como --identity-h, --text-h y
       --contact-h (las usan la traslacion, el slot y el recorte de la foto). Solo cambian en resize o al recortar. */
    useLayoutEffect(() => {
        const root = panelRef.current;
        const targets = [
            [identityRef.current, "--identity-h"],
            [textRef.current, "--text-h"],
            [contactRef.current, "--contact-h"],
        ].filter(([element]) => element);
        if (!root || targets.length === 0) {
            return undefined;
        }

        const lastHeights = new Map();
        const writeHeight = (name, height) => {
            const rounded = Math.round(height * 100) / 100;
            if (lastHeights.get(name) !== rounded) {
                lastHeights.set(name, rounded);
                root.style.setProperty(name, `${rounded}px`);
            }
        };
        const writeAll = () => targets.forEach(([element, name]) => writeHeight(name, element.offsetHeight));

        writeAll();

        if (typeof ResizeObserver === "undefined") {
            window.addEventListener("resize", writeAll);
            return () => window.removeEventListener("resize", writeAll);
        }

        const namesByElement = new Map(targets);
        const observer = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                const name = namesByElement.get(entry.target);
                if (!name) {
                    return;
                }
                const size = entry.borderBoxSize?.[0]?.blockSize;
                writeHeight(name, size ?? entry.target.offsetHeight);
            });
        });
        targets.forEach(([element]) => observer.observe(element));
        return () => observer.disconnect();
    }, []);

    /* Limpia el timer del estado "copiado" al desmontar. */
    useEffect(() => () => clearTimeout(copiedTimerRef.current), []);

    /* Copia el correo y muestra la confirmacion durante COPIED_MS. */
    const handleCopyEmail = useCallback(async () => {
        const copied = await copyToClipboard(copy.contact.email);
        clearTimeout(copiedTimerRef.current);
        setEmailCopied(copied);
        if (copied) {
            copiedTimerRef.current = setTimeout(() => setEmailCopied(false), COPIED_MS);
        }
    }, [copy.contact.email]);

    /* Pasa al toggle el centro y el tamano del boton en coordenadas de viewport: ahi nace el circulo del tema. */
    const handleToggleTheme = useCallback((event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        onToggleTheme?.({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            size: Math.max(rect.width, rect.height),
        });
    }, [onToggleTheme]);

    const copyLabel = emailCopied ? copy.contact.copied : copy.contact.copy;

    return (
        <div
            className="identity-panel"
            ref={panelRef}
            data-phase={phase}
            data-slot-active={slotActive || undefined}
            style={PANEL_STYLE}
        >
            <RootGlitch />

            <div className="identity-panel__strip" aria-hidden="true" />

            <div className="identity-panel__identity" ref={identityRef}>
                <div className="identity-panel__drops" aria-hidden="true">
                    <span className="identity-panel__drop" />
                    <span className="identity-panel__drops-extra">
                        <span className="identity-panel__drop identity-panel__drop--offset" />
                    </span>
                </div>
                <img
                    ref={photoRef}
                    className="identity-panel__photo"
                    src={fotoPerfil}
                    alt={copy.name}
                    width="300"
                    height="375"
                    decoding="async"
                    {...identityAction}
                />
                <div className="identity-panel__text" ref={textRef} {...textAction}>
                    <h1 className="identity-panel__name">{copy.name}</h1>
                    <ul className="identity-panel__roles">
                        {copy.roles.map((role) => (
                            <li key={role}>{role}</li>
                        ))}
                    </ul>
                </div>
                <div className="identity-panel__branch" ref={branchRef} aria-hidden="true">
                    <BranchGlitch runKey={branchRun} />
                </div>
            </div>

            <div className="identity-panel__slot">{children}</div>

            <div className="identity-panel__hint" aria-hidden="true">
                <span className="identity-panel__hint-lines">
                    <span>{copy.scrollHint}</span>
                    <span className="identity-panel__hint-alt">{copy.clickHint}</span>
                </span>
                <svg className="identity-panel__hint-arrow" viewBox="0 0 24 24" width="18" height="18">
                    <path d="M12 4v15m0 0-6-6m6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            <footer className="identity-panel__contact" ref={contactRef} inert={!isSplit}>
                <a
                    className="identity-panel__btn identity-panel__btn--icon"
                    href={copy.contact.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                >
                    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                        <path
                            fill="currentColor"
                            d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.83v1.5h.06c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.67 4.8 6.13v5.43h-4v-4.82c0-1.15-.02-2.63-1.6-2.63-1.6 0-1.85 1.25-1.85 2.55v4.9h-4v-11Z"
                        />
                    </svg>
                </a>

                <button
                    type="button"
                    className="identity-panel__btn identity-panel__btn--copy"
                    onClick={handleCopyEmail}
                    data-copied={emailCopied || undefined}
                    title={copy.contact.email}
                >
                    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                        {emailCopied ? (
                            <path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        ) : (
                            <path d="M3.5 6.5h17v11h-17zM4 7l8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                        )}
                    </svg>
                    <span className="identity-panel__copy-label" aria-live="polite">{copyLabel}</span>
                </button>

                <button
                    type="button"
                    className="identity-panel__btn identity-panel__btn--lang"
                    onClick={onToggleLanguage}
                    aria-label={copy.toggleLabel}
                >
                    <span data-active={language === "es" || undefined}>ES</span>
                    <span className="identity-panel__lang-sep">/</span>
                    <span data-active={language === "en" || undefined}>EN</span>
                </button>

                <button
                    type="button"
                    className="identity-panel__btn identity-panel__btn--icon identity-panel__btn--theme"
                    onClick={handleToggleTheme}
                    aria-label={copy.themeLabel}
                    aria-pressed={theme === "dark"}
                    title={copy.themeNames[theme === "dark" ? "light" : "dark"]}
                >
                    {/* Icono del tema al que se cambia: sol si hoy esta oscuro, luna si esta claro */}
                    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                        {theme === "dark" ? (
                            <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                        ) : (
                            <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                        )}
                    </svg>
                </button>
            </footer>
        </div>
    );
}

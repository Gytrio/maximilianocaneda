import React, { useEffect, useMemo, useState } from "react";

import fotoPerfil from "./assets/Foto-Perfil.jpg";
import lost from "./assets/LostSwampFoto.png";
import steven from "./assets/WhereisStevenFoto.jpg";
import catacombs from "./assets/Catacombsofempire.jpg";

import csharpLogo from "./assets/tech/csharp.png";
import unityLogo from "./assets/tech/unity.png";
import gitLogo from "./assets/tech/git.svg";
import reactLogo from "./assets/tech/react.svg";
import reaperLogo from "./assets/tech/reaper.svg";
import htmlLogo from "./assets/tech/html5.svg";
import cssLogo from "./assets/tech/css3.svg";
import blenderLogo from "./assets/tech/blender.svg";
import linkedinLogo from "./assets/tech/linkedin.svg";

const ROOT_PATH = "C:\\Users\\Maximiliano-Caneda";

const SECTIONS = [
    { id: "hero", navKey: "home", segment: { es: "", en: "" } },
    { id: "sobre-mi", navKey: "about", segment: { es: "Sobre-mi", en: "About-me" } },
    { id: "proyectos", navKey: "projects", segment: { es: "Proyectos", en: "Projects" } },
    { id: "contacto", navKey: "contact", segment: { es: "Contacto", en: "Contact" } },
];

const PROJECT_MEDIA = [
    { image: lost, url: "https://youtu.be/kIOqWF8WLMY", videoId: "kIOqWF8WLMY" },
    { image: steven, url: "https://youtu.be/6PNvMrnnZ7o", videoId: "6PNvMrnnZ7o" },
    { image: catacombs, url: "https://youtu.be/4uFiRBiggKE", videoId: "4uFiRBiggKE" },
];

const PRIMARY_TECH = [
    { src: csharpLogo, alt: "C#", name: "C#" },
    { src: unityLogo, alt: "Unity", name: "Unity" },
    { src: gitLogo, alt: "Git", name: "Git" },
    { src: reactLogo, alt: "React", name: "React" },
];

const SECONDARY_TECH = [
    { src: reaperLogo, alt: "Reaper", name: "Reaper" },
    { src: htmlLogo, alt: "HTML5", name: "HTML5" },
    { src: cssLogo, alt: "CSS3", name: "CSS3" },
    { src: blenderLogo, alt: "Blender", name: "Blender" },
];

/* Nodos y trazos del arte de cabecera (constelacion estilo line-art). */
const ART_NODES = [
    { cx: 90, cy: 120, r: 34 },
    { cx: 205, cy: 58, r: 13 },
    { cx: 300, cy: 168, r: 21 },
    { cx: 168, cy: 235, r: 8 },
    { cx: 415, cy: 92, r: 9 },
    { cx: 1110, cy: 118, r: 40 },
    { cx: 985, cy: 62, r: 12 },
    { cx: 900, cy: 176, r: 22 },
    { cx: 1045, cy: 240, r: 8 },
    { cx: 790, cy: 96, r: 10 },
    { cx: 600, cy: 42, r: 6 },
    { cx: 495, cy: 210, r: 7 },
    { cx: 705, cy: 216, r: 7 },
];

const ART_LINKS = [
    [0, 1], [1, 2], [2, 3], [3, 0], [1, 4], [4, 10],
    [5, 6], [6, 7], [7, 8], [8, 5], [6, 9], [9, 10],
    [2, 11], [7, 12], [11, 12], [4, 6], [9, 1],
];

export default function App() {
    const [language, setLanguage] = useState(() => {
        const stored = localStorage.getItem("portfolio-language");
        return stored === "en" || stored === "es" ? stored : "";
    });
    const [activeSection, setActiveSection] = useState("hero");
    const [emailCopied, setEmailCopied] = useState(false);

    /* El aviso de "copiado" vuelve solo al estado normal. */
    useEffect(() => {
        if (!emailCopied) {
            return undefined;
        }

        const timer = setTimeout(() => setEmailCopied(false), 2200);
        return () => clearTimeout(timer);
    }, [emailCopied]);

    useEffect(() => {
        document.body.style.overflow = language ? "auto" : "hidden";
        if (language) {
            localStorage.setItem("portfolio-language", language);
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [language]);

    /* Marca como activa la ultima seccion cuyo inicio ya cruzo el tercio superior de la pantalla. */
    useEffect(() => {
        if (!language) {
            return undefined;
        }

        const syncActiveSection = () => {
            const marker = window.innerHeight * 0.35;
            let current = SECTIONS[0].id;

            SECTIONS.forEach((section) => {
                const element = document.getElementById(section.id);
                if (element && element.getBoundingClientRect().top <= marker) {
                    current = section.id;
                }
            });

            /* Al final del documento la ultima seccion queda activa aunque no cruce el marcador. */
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollable > 8 && window.scrollY >= scrollable - 4) {
                current = SECTIONS[SECTIONS.length - 1].id;
            }

            setActiveSection(current);
        };

        syncActiveSection();
        window.addEventListener("scroll", syncActiveSection, { passive: true });
        window.addEventListener("resize", syncActiveSection);
        return () => {
            window.removeEventListener("scroll", syncActiveSection);
            window.removeEventListener("resize", syncActiveSection);
        };
    }, [language]);

    const content = useMemo(
        () => ({
            es: {
                nav: {
                    home: "Inicio",
                    about: "Sobre mí",
                    projects: "Proyectos",
                    contact: "Contacto",
                },
                tagline: "Unity Developer · Game Designer",
                intro: {
                    lead: "Soy desarrollador y diseñador de videojuegos. Trabajo con Unity y C# desde hace más de cuatro años y me especializo en llevar una idea desde el prototipo hasta un juego jugable y terminado.",
                    body: "Combino programación, Inteligencia Artificial, game design y level design para desarrollar simulaciones y videojuegos completos.",
                    featuredLabel: "Proyecto destacado",
                    featuredTitle: "Lost in the Swamp",
                },
                miniTags: ["Shooter", "Puzzles", "Plataformero", "Pensamiento crítico", "Adaptabilidad"],
                cta: {
                    projects: "Ver proyectos",
                    contact: "Hablemos",
                },
                about: {
                    title: "Sobre mí",
                    kicker: "Perfil",
                    paragraphs: [
                        "Soy Maximiliano Caneda, tengo 25 años y soy desarrollador y diseñador de videojuegos de Lanús, Buenos Aires. Mi formación en inglés desde temprana edad me permitió trabajar cómodamente con documentación técnica, pipelines y referencias de programación internacionales.",
                        "Me gradué como Licenciado en Producción de Simuladores y Videojuegos en la Universidad Abierta Interamericana (UAI) con un promedio de 8.70, y también soy Técnico en Programación por la EEST N° 5 “John F. Kennedy”. Mi tesis se tituló “El bajo nivel competitivo genera respuestas emocionales agresivas en jugadores”.",
                        "Además, completé una capacitación en React.js para fortalecer mi perfil como desarrollador Full Stack, combinando programación, diseño y desarrollo de sistemas interactivos tanto en videojuegos como en aplicaciones web.",
                    ],
                    work: "Trabajé en la empresa de juegos NFT ",
                    workSpan: " durante 1 año y realicé 3 juegos para esta empresa. Como estudiante, participé activamente en el ",
                    workEnd: " entre 2020 y 2024.",
                },
                education: {
                    kicker: "Formación",
                    title: "Estudios",
                    intro: "Mi formación académica y las capacitaciones que fui sumando.",
                    items: [
                        {
                            period: "2021 - 2024",
                            title: "Lic. en Producción de Simuladores y Videojuegos",
                            place: "Universidad Abierta Interamericana (UAI)",
                            details: [
                                "Promedio 8.70.",
                                "Tesis: “El bajo nivel competitivo genera respuestas emocionales agresivas en jugadores”.",
                            ],
                        },
                        {
                            period: "2019 - 2021",
                            title: "Tec. Universitaria en Desarrollo de Videojuegos",
                            details: ["Formación universitaria previa a la licenciatura."],
                        },
                        {
                            period: "2012 - 2018",
                            title: "Técnico en Programación",
                            place: "EEST N° 5 “John F. Kennedy”",
                            details: ["Base sólida en algoritmos, estructuras de datos y desarrollo de software."],
                        },
                        {
                            period: "2007 - 2018",
                            title: "Educación en inglés",
                            details: [
                                "Me permite trabajar con documentación técnica, pipelines y referencias de programación internacionales.",
                            ],
                        },
                        {
                            period: "Capacitación",
                            title: "Desarrollo Full Stack con React.js",
                            details: ["Programación web moderna para complementar mi perfil de desarrollador."],
                        },
                    ],
                },
                experience: {
                    kicker: "Trayectoria",
                    title: "Experiencia laboral",
                    intro: "Los estudios y equipos donde desarrollé videojuegos.",
                    items: [
                        {
                            period: "2024 - 2025",
                            title: "Games Station Studio",
                            place: "Desarrollo de videojuegos",
                            details: [
                                "Desarrollé mecánicas para los juegos Heroes of Valhalla y Grow Empire Rome.",
                                "Refactorización de código, optimización, corrección de bugs, testing, documentación y reparación de herramientas para el desarrollo legacy.",
                                "Desarrollo en C# usando patrones de diseño y prácticas variadas, en contacto con distintas disciplinas de arte y game design.",
                            ],
                        },
                        {
                            period: "2020 - 2024",
                            title: "Laboratorio LIVE - UAI",
                            place: "Laboratorio de videojuegos experimentales",
                            details: [
                                "Desarrollo de juegos y prototipos con mecánicas experimentales o poco usadas.",
                                "Desarrollo en C# usando patrones de diseño y prácticas como Facade, State, Clean Code y POO.",
                            ],
                        },
                        {
                            period: "2022 - 2023",
                            title: "Lightning Vortex Technologies",
                            place: "Unity Developer",
                            details: [
                                "Desarrollo de UI/UX de menús, opciones e inventario.",
                                "Corrección de bugs y testing.",
                                "Desarrollo en C# con el motor Unity.",
                                "Mockups orientados a juegos multijugador.",
                            ],
                        },
                        {
                            period: "2021 - 2022",
                            title: "Interlude.gg",
                            place: "Empresa de juegos NFT",
                            details: [
                                "Desarrollé los juegos Lost in the Swamp, Where is Steven? y Catacombs of Empire junto a sus 4 mapas en Unity, con total libertad creativa.",
                                "Desarrollo en C# aplicando prácticas, principios y patrones como POO, metodologías ágiles, Clean Code y State.",
                                "Arreglé y documenté assets estéticos, mecánicas y tools.",
                                "Trabajé con un equipo multidisciplinario de Francia, Uruguay y Argentina.",
                                "Verificación y generación de builds para PC.",
                            ],
                        },
                    ],
                },
                timeline: {
                    title: "Aptitudes",
                    kicker: "Stack",
                    intro: "Estas son algunas de las tecnologías las cuales uso.",
                    secondaryTitle: "Conocimientos secundarios",
                    secondaryIntro: "Estas son algunas de las tecnologías de las que tengo conocimientos.",
                },
                projects: {
                    title: "Mis Proyectos",
                    kicker: "Catálogo",
                    intro: "Juegos completos desarrollados para clientes y como pruebas técnicas.",
                    cards: [
                        {
                            code: "Supervivencia • 10 mins • 4 días",
                            title: "Lost in the Swamp",
                            description:
                                "Juego realizado en 4 días como prueba de ingreso, la única condición es que la duración ronde los 10 minutos de gameplay.",
                            link: "Ver gameplay",
                        },
                        {
                            code: "Puzzle • 10 días • cliente",
                            title: "Where is Steven?",
                            description: "Desarrollado con libertad creativa en 10 días para la empresa Interlude.",
                            link: "Ver gameplay",
                        },
                        {
                            code: "Acción • 4 mapas extra",
                            title: "Catacombs of Empire",
                            description:
                                "Tuve libertad creativa para crear el juego base y los 4 mapas extras. Desarrollado para la empresa Interlude.",
                            link: "Ver gameplay",
                        },
                    ],
                },
                footer: {
                    kicker: "Contacto",
                    title: "Contactame",
                    intro: "¿Tenés un proyecto en mente? Escribime y lo charlamos.",
                    email: "maxicaneda45@gmail.com",
                    emailCta: "Enviar un correo",
                    copy: "Copiar correo",
                    copied: "¡Copiado!",
                    rights: "Todos los derechos reservados.",
                },
                languageModal: {
                    title: "Elegí el idioma",
                    subtitle: "Seleccioná cómo querés navegar el porfolio.",
                    spanish: "Español",
                    english: "Inglés",
                },
                scrollTop: "Ir al inicio",
                toggleLabel: "Cambiar idioma",
            },
            en: {
                nav: {
                    home: "Home",
                    about: "About",
                    projects: "Projects",
                    contact: "Contact",
                },
                tagline: "Unity Developer · Game Designer",
                intro: {
                    lead: "I am a video game developer and designer. I have been working with Unity and C# for over four years and I specialise in taking an idea from prototype to a finished, playable game.",
                    body: "I combine programming, Artificial Intelligence, game design and level design to develop complete simulations and video games.",
                    featuredLabel: "Featured project",
                    featuredTitle: "Lost in the Swamp",
                },
                miniTags: ["Shooter", "Puzzles", "Platformer", "Critical thinking", "Adaptability"],
                cta: {
                    projects: "See projects",
                    contact: "Let’s talk",
                },
                about: {
                    title: "About me",
                    kicker: "Profile",
                    paragraphs: [
                        "I am Maximiliano Caneda, I am 25 years old, and a video game developer and designer based in Lanús, Buenos Aires. My early English education allows me to work comfortably with technical documentation, programming pipelines, and international development resources.",
                        "I hold a Bachelor’s degree in Simulation and Video Game Production from Universidad Abierta Interamericana (UAI), graduating with a GPA of 8.70. I am also a Programming Technician from EEST N° 5 “John F. Kennedy”. My thesis was titled “Low competitive levels generate aggressive emotional responses in players.”",
                        "In addition, I completed a React.js training program to strengthen my Full Stack development skills, allowing me to combine programming, design, and system development across both games and web applications.",
                    ],
                    work: "I worked at the NFT game company ",
                    workSpan: " for 1 year and created 3 games for the company. As a student, I actively participated in the ",
                    workEnd: " between 2020 and 2024.",
                },
                education: {
                    kicker: "Education",
                    title: "Studies",
                    intro: "My academic background and the training I have added along the way.",
                    items: [
                        {
                            period: "2021 - 2024",
                            title: "B.A. in Simulation and Video Game Production",
                            place: "Universidad Abierta Interamericana (UAI)",
                            details: [
                                "GPA 8.70.",
                                "Thesis: “Low competitive levels generate aggressive emotional responses in players.”",
                            ],
                        },
                        {
                            period: "2019 - 2021",
                            title: "University Technical Degree in Video Game Development",
                            details: ["University training completed before the bachelor’s degree."],
                        },
                        {
                            period: "2012 - 2018",
                            title: "Programming Technician",
                            place: "EEST N° 5 “John F. Kennedy”",
                            details: ["Solid grounding in algorithms, data structures and software development."],
                        },
                        {
                            period: "2007 - 2018",
                            title: "English education",
                            details: [
                                "Lets me work comfortably with technical documentation, pipelines and international programming resources.",
                            ],
                        },
                        {
                            period: "Training",
                            title: "Full Stack development with React.js",
                            details: ["Modern web programming to round out my developer profile."],
                        },
                    ],
                },
                experience: {
                    kicker: "Track record",
                    title: "Work experience",
                    intro: "The studios and teams where I built video games.",
                    items: [
                        {
                            period: "2024 - 2025",
                            title: "Games Station Studio",
                            place: "Video game development",
                            details: [
                                "Developed mechanics for the games Heroes of Valhalla and Grow Empire Rome.",
                                "Code refactoring, optimisation, bug fixing, testing, documentation and repair of legacy development tools.",
                                "C# development using design patterns and varied practices, working alongside different art and game design disciplines.",
                            ],
                        },
                        {
                            period: "2020 - 2024",
                            title: "LIVE Lab - UAI",
                            place: "Experimental video game lab",
                            details: [
                                "Development of games and prototypes with experimental or rarely used mechanics.",
                                "C# development using design patterns and practices such as Facade, State, Clean Code and OOP.",
                            ],
                        },
                        {
                            period: "2022 - 2023",
                            title: "Lightning Vortex Technologies",
                            place: "Unity Developer",
                            details: [
                                "UI/UX development for menus, options and inventory.",
                                "Bug fixing and testing.",
                                "C# development with the Unity engine.",
                                "Mockups aimed at multiplayer games.",
                            ],
                        },
                        {
                            period: "2021 - 2022",
                            title: "Interlude.gg",
                            place: "NFT game company",
                            details: [
                                "Built the games Lost in the Swamp, Where is Steven? and Catacombs of Empire along with its 4 maps in Unity, with full creative freedom.",
                                "C# development applying practices, principles and patterns such as OOP, agile methodologies, Clean Code and State.",
                                "Fixed and documented aesthetic assets, mechanics and tools.",
                                "Worked with a multidisciplinary team from France, Uruguay and Argentina.",
                                "Verification and generation of PC builds.",
                            ],
                        },
                    ],
                },
                timeline: {
                    title: "Skills",
                    kicker: "Stack",
                    intro: "These are some of the technologies I use.",
                    secondaryTitle: "Secondary knowledge",
                    secondaryIntro: "These are some of the technologies I have experience with.",
                },
                projects: {
                    title: "My Projects",
                    kicker: "Catalogue",
                    intro: "Complete games built for clients and as technical tests.",
                    cards: [
                        {
                            code: "Survival • 10 mins • 4 days",
                            title: "Lost in the Swamp",
                            description:
                                "A game built in 4 days as an admission test, with the only condition being around 10 minutes of gameplay.",
                            link: "Watch gameplay",
                        },
                        {
                            code: "Puzzle • 10 days • client",
                            title: "Where is Steven?",
                            description: "Developed with full creative freedom in 10 days for Interlude.",
                            link: "Watch gameplay",
                        },
                        {
                            code: "Action • 4 extra maps",
                            title: "Catacombs of Empire",
                            description:
                                "I had creative freedom to create the base game and four extra maps. Developed for Interlude.",
                            link: "Watch gameplay",
                        },
                    ],
                },
                footer: {
                    kicker: "Contact",
                    title: "Contact me",
                    intro: "Got a project in mind? Drop me a line and let’s talk.",
                    email: "maxicaneda45@gmail.com",
                    emailCta: "Send an email",
                    copy: "Copy email",
                    copied: "Copied!",
                    rights: "All rights reserved.",
                },
                languageModal: {
                    title: "Choose your language",
                    subtitle: "Select how you want to explore the portfolio.",
                    spanish: "Spanish",
                    english: "English",
                },
                scrollTop: "Back to top",
                toggleLabel: "Switch language",
            },
        }),
        []
    );

    const activeLanguage = language || "es";
    const copy = content[activeLanguage];

    /* Ruta tipo consola: se le agrega la carpeta de la seccion donde esta parado el visitante. */
    const terminalPath = useMemo(() => {
        const section = SECTIONS.find((item) => item.id === activeSection) ?? SECTIONS[0];
        const segment = section.segment[activeLanguage];
        return segment ? `${ROOT_PATH}\\${segment}>` : `${ROOT_PATH}>`;
    }, [activeSection, activeLanguage]);

    const handleLanguageSelect = (nextLanguage) => {
        setLanguage(nextLanguage);
    };

    const handleToggleLanguage = () => {
        setLanguage((current) => (current === "es" ? "en" : "es"));
    };

    const handleScrollTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    /* Copia el mail al portapapeles, con respaldo para navegadores sin Clipboard API. */
    const handleCopyEmail = async () => {
        const email = copy.footer.email;

        const copyWithTextarea = () => {
            const helper = document.createElement("textarea");
            helper.value = email;
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
                await navigator.clipboard.writeText(email);
                setEmailCopied(true);
                return;
            }
        } catch {
            /* La Clipboard API puede fallar en contexto no seguro: se usa el respaldo. */
        }

        try {
            setEmailCopied(copyWithTextarea());
        } catch {
            setEmailCopied(false);
        }
    };

    return (
        <div className="page">
            {!language && (
                <div className="language-modal" role="dialog" aria-modal="true" aria-label={copy.languageModal.title}>
                    <div className="language-card">
                        <h2>{copy.languageModal.title}</h2>
                        <p>{copy.languageModal.subtitle}</p>
                        <div className="language-actions">
                            <button type="button" onClick={() => handleLanguageSelect("es")}>
                                {copy.languageModal.spanish}
                            </button>
                            <button type="button" onClick={() => handleLanguageSelect("en")}>
                                {copy.languageModal.english}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <header className="top-bar">
                <div className="top-bar-inner">
                    <a className="brand" href="#hero" aria-label={terminalPath}>
                        <span className="brand-path">{terminalPath}</span>
                        <span className="brand-caret animated flash" aria-hidden>
                            _
                        </span>
                    </a>

                    <nav className="nav-links">
                        {SECTIONS.map((section) => (
                            <a
                                key={section.id}
                                href={`#${section.id}`}
                                className={activeSection === section.id ? "is-active" : ""}
                                onClick={() => setActiveSection(section.id)}
                            >
                                {copy.nav[section.navKey]}
                            </a>
                        ))}
                    </nav>

                    <div className="top-bar-actions">
                        <a
                            className="icon-link"
                            href="https://www.linkedin.com/in/maximiliano-caneda"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="LinkedIn"
                        >
                            <svg viewBox="0 0 24 24" aria-hidden focusable="false">
                                <path
                                    fill="currentColor"
                                    d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0ZM.25 8.25h4.5V24h-4.5V8.25Zm7.5 0h4.31v2.15h.06c.6-1.14 2.07-2.34 4.26-2.34 4.56 0 5.4 3 5.4 6.9V24h-4.5v-7.94c0-1.9-.03-4.34-2.64-4.34-2.64 0-3.05 2.06-3.05 4.2V24h-4.5V8.25Z"
                                />
                            </svg>
                        </a>
                        <button className="lang-toggle" type="button" onClick={handleToggleLanguage} aria-label={copy.toggleLabel}>
                            <span className="lang-icon" aria-hidden>
                                🌐
                            </span>
                            <span className="lang-text">{language ? language.toUpperCase() : "ES/EN"}</span>
                        </button>
                    </div>
                </div>
            </header>

            <section className="hero" id="hero">
                <div className="hero-art">
                    <svg className="hero-art-svg" viewBox="0 0 1200 300" preserveAspectRatio="xMidYMid slice" aria-hidden>
                        {ART_LINKS.map(([from, to]) => (
                            <line
                                key={`${from}-${to}`}
                                x1={ART_NODES[from].cx}
                                y1={ART_NODES[from].cy}
                                x2={ART_NODES[to].cx}
                                y2={ART_NODES[to].cy}
                            />
                        ))}
                        {ART_NODES.map((node) => (
                            <circle key={`${node.cx}-${node.cy}`} cx={node.cx} cy={node.cy} r={node.r} />
                        ))}
                    </svg>
                    <div className="hero-portrait">
                        <img src={fotoPerfil} alt="Maximiliano Caneda" />
                    </div>
                </div>

                <div className="hero-wordmark">
                    <h1>Maximiliano Caneda</h1>
                    <p className="hero-tagline">{copy.tagline}</p>
                </div>
            </section>

            <section className="intro">
                <div className="intro-grid">
                    <div className="intro-copy">
                        <p className="lead">{copy.intro.lead}</p>
                        <p className="texto">{copy.intro.body}</p>
                        <div className="mini-tags">
                            {copy.miniTags.map((tag) => (
                                <span className="pill" key={tag}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <div className="cta-row">
                            <a className="cta-btn primary" href="#proyectos">
                                {copy.cta.projects}
                                <svg className="btn-arrow" viewBox="0 0 24 24" aria-hidden focusable="false">
                                    <path
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 12h13m-5.5-6.5L19 12l-6.5 6.5"
                                    />
                                </svg>
                            </a>
                            <a className="cta-btn" href="#contacto">
                                {copy.cta.contact}
                            </a>
                        </div>
                    </div>

                    <div className="intro-media">
                        <span className="media-label">{copy.intro.featuredLabel}</span>
                        <div className="media-frame">
                            <iframe
                                src={`https://www.youtube-nocookie.com/embed/${PROJECT_MEDIA[0].videoId}`}
                                title={copy.intro.featuredTitle}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>

            </section>

            <section className="section-panel" id="sobre-mi">
                <div className="section-header">
                    <span className="kicker">{copy.about.kicker}</span>
                    <h2>{copy.about.title}</h2>
                </div>

                <div className="panel-grid">
                    <div className="panel-card">
                        {copy.about.paragraphs.map((paragraph) => (
                            <p className="texto" key={paragraph}>
                                {paragraph}
                            </p>
                        ))}
                    </div>
                    <div className="panel-card">
                        <p className="texto">
                            {copy.about.work}
                            <a href="https://twitter.com/ProjInterlude" target="_blank" rel="noreferrer">
                                Interlude.gg
                            </a>
                            {copy.about.workSpan}
                            <a href="https://live-games.itch.io/" target="_blank" rel="noreferrer">
                                Laboratorio de videojuegos experimentales de la UAI
                            </a>
                            {copy.about.workEnd}
                        </p>
                    </div>
                </div>

                <div className="section-header spaced">
                    <span className="kicker">{copy.education.kicker}</span>
                    <h2>{copy.education.title}</h2>
                </div>
                <p className="texto">{copy.education.intro}</p>
                <ol className="record-list">
                    {copy.education.items.map((item) => (
                        <li className="record-item" key={item.title}>
                            <span className="record-period">{item.period}</span>
                            <div className="record-body">
                                <h4>{item.title}</h4>
                                {item.place && <p className="record-place">{item.place}</p>}
                                <ul className="record-detail">
                                    {item.details.map((detail) => (
                                        <li key={detail}>{detail}</li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ol>

                <div className="section-header spaced">
                    <span className="kicker">{copy.experience.kicker}</span>
                    <h2>{copy.experience.title}</h2>
                </div>
                <p className="texto">{copy.experience.intro}</p>
                <ol className="record-list">
                    {copy.experience.items.map((item) => (
                        <li className="record-item" key={item.title}>
                            <span className="record-period">{item.period}</span>
                            <div className="record-body">
                                <h4>{item.title}</h4>
                                {item.place && <p className="record-place">{item.place}</p>}
                                <ul className="record-detail">
                                    {item.details.map((detail) => (
                                        <li key={detail}>{detail}</li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ol>

                <div className="section-header spaced">
                    <span className="kicker">{copy.timeline.kicker}</span>
                    <h2>{copy.timeline.title}</h2>
                </div>
                <p className="texto">{copy.timeline.intro}</p>
                <div className="tech-list">
                    {PRIMARY_TECH.map((tech) => (
                        <figure className="tech-item" key={tech.name}>
                            <img className="tech" src={tech.src} alt={tech.alt} loading="lazy" />
                            <figcaption>{tech.name}</figcaption>
                        </figure>
                    ))}
                </div>

                <h3 className="sub-heading">{copy.timeline.secondaryTitle}</h3>
                <p className="texto">{copy.timeline.secondaryIntro}</p>
                <div className="tech-list">
                    {SECONDARY_TECH.map((tech) => (
                        <figure className="tech-item" key={tech.name}>
                            <img className="tech" src={tech.src} alt={tech.alt} loading="lazy" />
                            <figcaption>{tech.name}</figcaption>
                        </figure>
                    ))}
                </div>
            </section>

            <section className="projects" id="proyectos">
                <div className="section-header">
                    <span className="kicker">{copy.projects.kicker}</span>
                    <h2>{copy.projects.title}</h2>
                </div>
                <p className="texto">{copy.projects.intro}</p>

                <div className="proyectos">
                    {copy.projects.cards.map((card, index) => (
                        <article className="card" key={card.title}>
                            <a className="card-media" href={PROJECT_MEDIA[index].url} target="_blank" rel="noreferrer">
                                <img src={PROJECT_MEDIA[index].image} alt={card.title} loading="lazy" />
                            </a>
                            <div className="card-body">
                                <span className="card-code">{card.code}</span>
                                <h3>
                                    <a href={PROJECT_MEDIA[index].url} target="_blank" rel="noreferrer">
                                        {card.title}
                                    </a>
                                </h3>
                                <p>{card.description}</p>
                                <a className="link-button" href={PROJECT_MEDIA[index].url} target="_blank" rel="noreferrer">
                                    {card.link}
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <footer id="contacto">
                <div className="footer-inner">
                    <span className="kicker light">{copy.footer.kicker}</span>
                    <h2>{copy.footer.title}</h2>
                    <p className="footer-intro">{copy.footer.intro}</p>
                    <div className="footer-mail-row">
                        <a className="footer-mail" href={`mailto:${copy.footer.email}`}>
                            {copy.footer.email}
                        </a>
                        <button
                            className={`copy-mail${emailCopied ? " is-copied" : ""}`}
                            type="button"
                            onClick={handleCopyEmail}
                            aria-label={emailCopied ? copy.footer.copied : copy.footer.copy}
                            title={emailCopied ? copy.footer.copied : copy.footer.copy}
                        >
                            {emailCopied ? (
                                <svg viewBox="0 0 24 24" aria-hidden focusable="false">
                                    <path
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m5 12.5 4.5 4.5L19 7.5"
                                    />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" aria-hidden focusable="false">
                                    <rect
                                        x="9"
                                        y="9"
                                        width="11"
                                        height="11"
                                        rx="2"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.9"
                                    />
                                    <path
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.9"
                                        strokeLinecap="round"
                                        d="M5.5 15H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v.5"
                                    />
                                </svg>
                            )}
                            <span className="copy-mail-text">{emailCopied ? copy.footer.copied : copy.footer.copy}</span>
                        </button>
                    </div>
                    <div className="footer-socials">
                        <a href="https://www.linkedin.com/in/maximiliano-caneda" target="_blank" rel="noreferrer">
                            <img src={linkedinLogo} className="red-social" alt="LinkedIn" loading="lazy" />
                        </a>
                        <a className="cta-btn primary" href={`mailto:${copy.footer.email}`}>
                            {copy.footer.emailCta}
                        </a>
                    </div>
                    <p className="footer-legal">
                        © {new Date().getFullYear()} Maximiliano Caneda. {copy.footer.rights}
                    </p>
                </div>
            </footer>

            <button className="scroll-top-toast" type="button" onClick={handleScrollTop} aria-label={copy.scrollTop}>
                <span className="scroll-top-icon" aria-hidden>
                    ↑
                </span>
                <span className="scroll-top-label">{copy.scrollTop}</span>
            </button>
        </div>
    );
}

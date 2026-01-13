import React, { useEffect, useMemo, useState } from "react";

import fotoPerfil from "./assets/Foto-Perfil.jpg";
import lost from "./assets/LostSwampFoto.png";
import steven from "./assets/WhereisStevenFoto.jpg";
import catacombs from "./assets/Catacombsofempire.jpg";

export default function App() {
    const [language, setLanguage] = useState(() => {
        const stored = localStorage.getItem("portfolio-language");
        return stored === "en" || stored === "es" ? stored : "";
    });

    useEffect(() => {
        document.body.style.overflow = language ? "auto" : "hidden";
        if (language) {
            localStorage.setItem("portfolio-language", language);
        }
        return () => {
            document.body.style.overflow = "auto";
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
                badges: ["Unity Dev", "Código y creatividad"],
                tag: "Unity / C#",
                role: "Unity Developer",
                availability: "Disponibilidad inmediata",
                miniTags: ["Shooter", "Puzzles", "Plataformero", "Pensamiento crítico", "Adaptabilidad"],
                cta: {
                    projects: "Ver proyectos",
                    contact: "Hablemos",
                },
                stats: [
                    { number: "10+", label: "Prototipos" },
                    { number: "3", label: "Juegos desarrollados" },
                    { number: "4", label: "Años de experiencia" },
                ],
                about: {
                    title: "Sobre mí",
                    paragraphs: [
                        "Soy Maximiliano Caneda, tengo 25 años y soy desarrollador y diseñador de videojuegos de Lanús, Buenos Aires. Mi formación en inglés desde temprana edad me permitió trabajar cómodamente con documentación técnica, pipelines y referencias de programación internacionales.",
                        "Me gradué como Licenciado en Desarrollo de Simuladores y Videojuegos en la Universidad Abierta Interamericana (UAI) con un promedio de 8.70, y también soy Técnico en Programación por la EEST N° 5 “John F. Kennedy”. Mi tesis se tituló “El bajo nivel competitivo genera respuestas emocionales agresivas en jugadores”.",
                        "Además, completé una capacitación en React.js para fortalecer mi perfil como desarrollador Full Stack, combinando programación, diseño y desarrollo de sistemas interactivos tanto en videojuegos como en aplicaciones web.",
                    ],
                    work: "Trabajé en la empresa de juegos NFT ",
                    workSpan:
                        " durante 1 año y realicé 3 juegos para esta empresa. Como estudiante, participé activamente en el ",
                    workEnd: " durante la pandemia entre 2020 e inicios de 2021.",
                },
                timeline: {
                    title: "Aptitudes",
                    intro: "Estas son algunas de las tecnologías las cuales uso.",
                    secondaryTitle: "Conocimientos secundarios",
                    secondaryIntro: "Estas son algunas de las tecnologías de las que tengo conocimientos",
                    items: [
                        { year: "2020-2021", label: "Laboratorio de videojuegos UAI" },
                        { year: "2022", label: "Interlude.gg - 3 juegos NFT" },
                        { year: "2024-2025", label: "Games Station Studio" },
                        { year: "Hoy", label: "Lic. desarrollo de simuladores y videojuegos" },
                    ],
                },
                projects: {
                    title: "Mis Proyectos",
                    cards: [
                        {
                            code: "Supervivencia • 10 mins • 4 días",
                            title: "Lost in the Swamp",
                            description:
                                "Juego realizado en 4 días como prueba de ingreso, la a única condición es que la duracion ronde los 10 minutos de gameplay.",
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
                    title: "Contactame",
                    email: "maxicaneda45@gmail.com",
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
                badges: ["Unity Dev", "Code & Creativity"],
                tag: "Unity / C#",
                role: "Unity Developer",
                availability: "Available immediately",
                miniTags: ["Shooter", "Puzzles", "Platformer", "Critical thinking", "Adaptability"],
                cta: {
                    projects: "See projects",
                    contact: "Let’s talk",
                },
                stats: [
                    { number: "10+", label: "Prototypes" },
                    { number: "3", label: "Released games" },
                    { number: "4", label: "Years of experience" },
                ],
                about: {
                    title: "About me",
                    paragraphs: [
                        "I am Maximiliano Caneda, I am 25 years old, and a video game developer and designer based in Lanús, Buenos Aires. My early English education allows me to work comfortably with technical documentation, programming pipelines, and international development resources.",
                        "I hold a Bachelor’s degree in Simulation and Video Game Development from Universidad Abierta Interamericana (UAI), graduating with a GPA of 8.70. I am also a Programming Technician from EEST N° 5 “John F. Kennedy”. My thesis was titled “Low competitive levels generate aggressive emotional responses in players.”",
                        "In addition, I completed a React.js training program to strengthen my Full Stack development skills, allowing me to combine programming, design, and system development across both games and web applications.",
                    ],
                    work: "I worked at the NFT game company ",
                    workSpan:
                        " for 1 year and created 3 games for the company. As a student, I actively participated in the ",
                    workEnd: " during the pandemic between 2020 and early 2021.",
                },
                timeline: {
                    title: "Skills",
                    intro: "These are some of the technologies I use.",
                    secondaryTitle: "Secondary knowledge",
                    secondaryIntro: "These are some of the technologies I have experience with.",
                    items: [
                        { year: "2020-2021", label: "UAI experimental game lab" },
                        { year: "2022", label: "Interlude.gg - 3 NFT games" },
                        { year: "2024-2025", label: "Games Station Studio" },
                        { year: "Today", label: "B.A. in simulator & video game development" },
                    ],
                },
                projects: {
                    title: "My Projects",
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
                    title: "Contact me",
                    email: "maxicaneda45@gmail.com",
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

    const copy = content[language || "es"];

    const handleLanguageSelect = (nextLanguage) => {
        setLanguage(nextLanguage);
    };

    const handleToggleLanguage = () => {
        setLanguage((current) => (current === "es" ? "en" : "es"));
    };

    const handleScrollTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
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
                <div className="brand">
                    <span className="pulse-dot" aria-hidden />
                    <div>
                        <h3>C:\\Users\\Maximiliano-Caneda&gt;</h3>
                    </div>
                </div>
                <nav className="nav-links">
                    <a href="#hero">{copy.nav.home}</a>
                    <a href="#sobre-mi">{copy.nav.about}</a>
                    <a href="#proyectos">{copy.nav.projects}</a>
                    <a href="#contacto">{copy.nav.contact}</a>
                </nav>
                <button className="status lang-toggle" type="button" onClick={handleToggleLanguage} aria-label={copy.toggleLabel}>
                    <span className="lang-icon" aria-hidden>
                        🌐
                    </span>
                    <span className="lang-text">{language ? language.toUpperCase() : "ES/EN"}</span>
                    <div className="animated flash" aria-hidden>
                        _
                    </div>
                </button>
            </header>

            <section className="hero" id="hero">
                <div className="grid-overlay" aria-hidden />
                <div className="hero-card">
                    <div className="badge-row">
                        {copy.badges.map((badge) => (
                            <span className="badge" key={badge}>
                                {badge}
                            </span>
                        ))}
                    </div>
                    <div className="hero-body">
                        <div className="hero-main">
                            <div className="hero-focus">
                                <div className="hero-photo">
                                    <div className="caja-cara big">
                                        <img className="cara" src={fotoPerfil} alt="Maximiliano Caneda" />
                                    </div>
                                </div>
                                <div className="identity-copy">
                                    <p className="tag">{copy.tag}</p>
                                    <h1>Maximiliano Caneda</h1>
                                    <p className="profile-role">{copy.role}</p>
                                    <div className="availability availability-pill">{copy.availability}</div>
                                </div>
                            </div>
                            
                            <div className="mini-tags">
                                {copy.miniTags.map((tag) => (
                                    <span className="pill" key={tag}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <div className="cta-row">
                                <a className="cta-btn primary" href="#proyectos">{copy.cta.projects}</a>
                                <a className="cta-btn primary ghost" href="#contacto">{copy.cta.contact}</a>
                            </div>
                            <div className="hero-grid">
                                {copy.stats.map((stat) => (
                                    <div className="stat" key={stat.label}>
                                        <span className="stat-number">{stat.number}</span>
                                        <span className="stat-label">{stat.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-panel" id="sobre-mi">
                <div className="section-header">
                    <div className="accent-bar" aria-hidden />
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
                            <a href="https://twitter.com/ProjInterlude" target="_blank" rel="noreferrer">Interlude.gg</a>
                            {copy.about.workSpan}
                            <a href="https://live-games.itch.io/" target="_blank" rel="noreferrer">Laboratorio de videojuegos experimentales de la UAI</a>
                            {copy.about.workEnd}
                        </p>
                        <div className="timeline">
                            {copy.timeline.items.map((item) => (
                                <div className="timeline-item" key={item.label}>
                                    <span className="pill">{item.year}</span>
                                    <span>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="section-header">
                    <div className="accent-bar" aria-hidden />
                    <h2>{copy.timeline.title}</h2>
                </div>
                <p className="texto">{copy.timeline.intro}</p>
                <div className="aptitudes">
                    <div className="tech-list">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/4/4f/Csharp_Logo.png" className="tech"
                             alt="C#"/>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Official_unity_logo.png"
                             className="tech" alt="Unity"/>
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Git-logo.svg/1280px-Git-logo.svg.png"
                            className="tech" alt="Git"/>
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/2300px-React-icon.svg.png"
                            className="tech" alt="React"/>

                    </div>
                </div>

                <h3>{copy.timeline.secondaryTitle}</h3>
                <p className="texto">{copy.timeline.secondaryIntro}</p>
                <div className="aptitudes">
                    <div className="tech-list">
                        <img src="https://upload.wikimedia.org/wikipedia/fr/3/33/Reaper_Logo.png" className="tech" alt="Reaper" />
                        <img src="https://www.seekpng.com/png/full/222-2229726_intro-to-html-css-html-css-icon.png" className="tech" alt="HTML/CSS" />
                        <img src="https://download.blender.org/branding/community/blender_community_badge_white.png" className="tech" alt="Blender" />
                    </div>
                </div>
            </section>

            <section className="projects" id="proyectos">
                <div className="section-header">
                    <div className="accent-bar" aria-hidden />
                    <h2>{copy.projects.title}</h2>
                </div>
                <div className="proyectos">
                    <div className="card">
                        <div className="card-code">{copy.projects.cards[0].code}</div>
                        <a href="https://youtu.be/kIOqWF8WLMY" target="_blank" rel="noreferrer">
                            <h3>{copy.projects.cards[0].title}</h3>
                            <img src={lost} alt="Lost in the Swamp" />
                        </a>
                        <p>{copy.projects.cards[0].description}</p>
                        <a className="link-button" href="https://youtu.be/kIOqWF8WLMY" target="_blank" rel="noreferrer">
                            {copy.projects.cards[0].link}
                        </a>
                    </div>

                    <div className="card">
                        <div className="card-code">{copy.projects.cards[1].code}</div>
                        <a href="https://youtu.be/6PNvMrnnZ7o" target="_blank" rel="noreferrer">
                            <h3>{copy.projects.cards[1].title}</h3>
                            <img src={steven} alt="Where is Steven?" />
                        </a>
                        <p>{copy.projects.cards[1].description}</p>
                        <a className="link-button" href="https://youtu.be/6PNvMrnnZ7o" target="_blank" rel="noreferrer">
                            {copy.projects.cards[1].link}
                        </a>
                    </div>

                    <div className="card">
                        <div className="card-code">{copy.projects.cards[2].code}</div>
                        <a href="https://youtu.be/4uFiRBiggKE" target="_blank" rel="noreferrer">
                            <h3>{copy.projects.cards[2].title}</h3>
                            <img src={catacombs} alt="Catacombs of Empire" />
                        </a>
                        <p>{copy.projects.cards[2].description}</p>
                        <a className="link-button" href="https://youtu.be/4uFiRBiggKE" target="_blank" rel="noreferrer">
                            {copy.projects.cards[2].link}
                        </a>
                    </div>
                </div>
            </section>

            <footer id="contacto">
                <h2>{copy.footer.title}</h2>
                <div className="contacto">
                    <hr />
                    <a href="https://www.linkedin.com/in/maximiliano-caneda" target="_blank" rel="noreferrer">
                        <img src="https://cdn.worldvectorlogo.com/logos/linkedin-icon-2.svg" className="red-social" alt="LinkedIn" />
                    </a>
                    <hr />
                </div>
                <h2>{copy.footer.email}</h2>
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

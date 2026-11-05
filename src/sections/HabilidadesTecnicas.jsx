import { SECTIONS_COPY, PRIMARY_TECH, SECONDARY_TECH } from "../content/sections.js";
import "./sections.css";

/* Grilla de tecnologias con logo y nombre. */
function TechGrid({ items }) {
    return (
        <ul className="sec-tech-grid">
            {items.map((tech) => (
                <li className="sec-tech" key={tech.name}>
                    <img src={tech.src} alt={tech.alt} loading="lazy" />
                    <span>{tech.name}</span>
                </li>
            ))}
        </ul>
    );
}

/* Seccion Habilidades tecnicas: stack principal y conocimientos secundarios. */
export default function HabilidadesTecnicas({ language }) {
    const copy = SECTIONS_COPY[language].skills;

    return (
        <article className="sec sec-habilidades">
            <header className="sec-header">
                <span className="sec-kicker">{copy.kicker}</span>
                <h2>{copy.title}</h2>
            </header>
            <p className="sec-text">{copy.intro}</p>
            <TechGrid items={PRIMARY_TECH} />
            <h3 className="sec-subtitle">{copy.secondaryTitle}</h3>
            <p className="sec-text">{copy.secondaryIntro}</p>
            <TechGrid items={SECONDARY_TECH} />
        </article>
    );
}

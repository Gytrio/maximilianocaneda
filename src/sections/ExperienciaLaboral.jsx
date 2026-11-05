import { SECTIONS_COPY } from "../content/sections.js";
import RecordList from "./RecordList.jsx";
import "./sections.css";

/* Seccion Experiencia laboral del timeline. */
export default function ExperienciaLaboral({ language }) {
    const copy = SECTIONS_COPY[language].experience;

    return (
        <article className="sec sec-experiencia">
            <header className="sec-header">
                <span className="sec-kicker">{copy.kicker}</span>
                <h2>{copy.title}</h2>
            </header>
            <p className="sec-text">{copy.intro}</p>
            <RecordList items={copy.items} />
        </article>
    );
}

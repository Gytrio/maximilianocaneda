import { SECTIONS_COPY } from "../content/sections.js";
import RecordList from "./RecordList.jsx";
import "./sections.css";

/* Seccion Estudios y capacitaciones del timeline. */
export default function EstudiosCapacitaciones({ language }) {
    const copy = SECTIONS_COPY[language].education;

    return (
        <article className="sec sec-estudios">
            <header className="sec-header">
                <span className="sec-kicker">{copy.kicker}</span>
                <h2>{copy.title}</h2>
            </header>
            <p className="sec-text">{copy.intro}</p>
            <RecordList items={copy.items} />
            <h3 className="sec-subtitle">{copy.trainingTitle}</h3>
            <RecordList items={copy.training} />
        </article>
    );
}

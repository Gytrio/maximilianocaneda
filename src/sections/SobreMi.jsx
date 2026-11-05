import { SECTIONS_COPY } from "../content/sections.js";
import "./sections.css";

/* Seccion Sobre mi: perfil completo, sin desplegable. */
export default function SobreMi({ language }) {
    const { about, intro, miniTags } = SECTIONS_COPY[language];

    return (
        <article className="sec sec-sobre-mi">
            <header className="sec-header">
                <span className="sec-kicker">{about.kicker}</span>
                <h2>{about.title}</h2>
            </header>
            <p className="sec-lead">{intro.lead}</p>
            <p className="sec-text">{intro.body}</p>
            {about.highlights.map((text) => (
                <p className="sec-text sec-highlight" key={text}>{text}</p>
            ))}
            {about.more.map((text) => (
                <p className="sec-text" key={text}>{text}</p>
            ))}
            <p className="sec-text">
                {about.work}
                <a href="https://twitter.com/ProjInterlude" target="_blank" rel="noreferrer">Interlude.gg</a>
                {about.workSpan}
                <a href="https://live-games.itch.io/" target="_blank" rel="noreferrer">{about.workLab}</a>
                {about.workEnd}
            </p>
            {about.closing.map((text) => (
                <p className="sec-text" key={text}>{text}</p>
            ))}
            <ul className="sec-pills">
                {miniTags.map((tag) => (
                    <li className="sec-pill" key={tag}>{tag}</li>
                ))}
            </ul>
        </article>
    );
}

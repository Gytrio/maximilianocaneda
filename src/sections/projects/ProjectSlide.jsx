import ProjectMedia from "./ProjectMedia.jsx";

/* Un proyecto en pantalla. Todos quedan montados (asi cada video conserva su posicion al volver), pero solo
   se ve el activo: entra con fade y el que se va sale con un fade corto.
   Los pares tienen el medio a la izquierda y los impares a la derecha. Con video + fotos la descripcion queda
   en su columna (layout "split"); si no, el texto largo continua por debajo del medio (layout "flow").
   La descripcion puede ser un texto o una lista de parrafos; `badge` (opcional) es el cartel junto al titulo. */
export default function ProjectSlide({ project, text, index, period, badge, state, playing }) {
    const side = index % 2 === 0 ? "start" : "end";
    const layout = project.video && project.images?.length ? "split" : "flow";
    const paragraphs = Array.isArray(text.description) ? text.description : [text.description];

    return (
        <article
            className={`prj-slide prj-slide--${side} prj-card prj-card--${layout}`}
            data-state={state}
            aria-hidden={state === "hidden" || undefined}
        >
            <div className="prj-media">
                <ProjectMedia project={project} title={text.title} playing={playing} />
            </div>
            <header className="prj-head">
                <span className="prj-period">{period}</span>
                <div className="prj-title-row">
                    <h3 className="prj-title">{text.title}</h3>
                    {badge && (
                        <span className="prj-badge">
                            <span className="prj-badge-dot" aria-hidden="true" />
                            {badge}
                        </span>
                    )}
                </div>
            </header>
            <div className="prj-desc">
                {paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                ))}
            </div>
        </article>
    );
}

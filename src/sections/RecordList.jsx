import "./sections.css";

/* Lista de registros (periodo, titulo, lugar y detalles) para Experiencia y Estudios. */
export default function RecordList({ items }) {
    return (
        <ul className="sec-records">
            {items.map((item) => (
                <li className="sec-record" key={`${item.period}-${item.title}`}>
                    <span className="sec-record-period">{item.period}</span>
                    <div className="sec-record-body">
                        <h3>{item.title}</h3>
                        {item.place ? <p className="sec-record-place">{item.place}</p> : null}
                        <ul className="sec-record-details">
                            {item.details.map((detail) => (
                                <li key={detail}>{detail}</li>
                            ))}
                        </ul>
                    </div>
                </li>
            ))}
        </ul>
    );
}

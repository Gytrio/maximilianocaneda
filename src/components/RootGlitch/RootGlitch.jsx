import { MOTION } from "../../config/motion";
import "./RootGlitch.css";

/* Raiz circular translucida detras de la identidad, solo en el hero: anillos concentricos con textura de
   glitch que nacen en el centro de la foto y se extienden hasta los bordes de la pantalla, apagandose hacia
   afuera. Es decorativa y no recibe el puntero; se desvanece apenas arranca el scroll hacia la franja. */
export default function RootGlitch() {
    return (
        <div
            className="root-glitch"
            aria-hidden="true"
            style={{ "--root-dur": `${MOTION.rootGlitch}ms` }}
        >
            <div className="root-glitch__field">
                <div className="root-glitch__rings" />
                <div className="root-glitch__scan" />
                <div className="root-glitch__pixels" />
            </div>
        </div>
    );
}

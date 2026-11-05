/* Registro de secciones del timeline. Para sumar o cambiar una seccion solo se toca este archivo.
   interactive: false => el item se dibuja en el timeline pero su onClick no hace nada. */
import SobreMi from "./SobreMi.jsx";
import Proyectos from "./Proyectos.jsx";
import HabilidadesTecnicas from "./HabilidadesTecnicas.jsx";
import ExperienciaLaboral from "./ExperienciaLaboral.jsx";
import EstudiosCapacitaciones from "./EstudiosCapacitaciones.jsx";

export const TIMELINE_SECTIONS = [
    { id: "sobre-mi", label: { es: "Sobre mí", en: "About me" }, Component: SobreMi, interactive: true },
    { id: "proyectos", label: { es: "Proyectos", en: "Projects" }, Component: Proyectos, interactive: true },
    { id: "habilidades", label: { es: "Habilidades técnicas", en: "Technical skills" }, Component: HabilidadesTecnicas, interactive: true },
    { id: "experiencia", label: { es: "Experiencia laboral", en: "Work experience" }, Component: ExperienciaLaboral, interactive: true },
    { id: "estudios", label: { es: "Estudios y capacitaciones", en: "Education & training" }, Component: EstudiosCapacitaciones, interactive: true },
];

export const getSection = (id) => TIMELINE_SECTIONS.find((section) => section.id === id) ?? null;

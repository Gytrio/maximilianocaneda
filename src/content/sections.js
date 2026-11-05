/* Textos y assets de las secciones del timeline (es/en). */
import lost from "../assets/projects/lost-in-the-swamp.png";
import steven from "../assets/projects/where-is-steven.jpg";
import catacombs from "../assets/projects/catacombs-of-empire.jpg";

import csharpLogo from "../assets/tech/csharp.png";
import unityLogo from "../assets/tech/unity.png";
import gitLogo from "../assets/tech/git.svg";
import reactLogo from "../assets/tech/react.svg";
import reaperLogo from "../assets/tech/reaper.svg";
import htmlLogo from "../assets/tech/html5.svg";
import cssLogo from "../assets/tech/css3.svg";
import blenderLogo from "../assets/tech/blender.svg";

/* Ruta de un medio de /public/media/projects/<id>/ respetando el base de GitHub Pages.
   Cada proyecto tiene su carpeta con el mismo id que usa en PROJECTS.
   El nombre del archivo se escribe tal cual esta en el disco: se codifica aca para los espacios. */
const projectMedia = (id, file) => `${import.meta.env.BASE_URL}media/projects/${id}/${encodeURIComponent(file)}`;

/* Datos de cada proyecto que no dependen del idioma, del mas reciente al mas viejo (orden en que se muestran).
   - period: { start, end } => "2021 - 2022" | { start } => "2021" | { start, current: true } => "2021 - Actualidad"
   - video (opcional): { type: "file", src } para un archivo propio, { type: "youtube", id } para YouTube.
     Se reproduce solo, sin controles, en silencio y en bucle mientras el proyecto esta en pantalla.
   - poster (opcional): imagen que se ve hasta que el video arranca (o la imagen principal si no hay video).
   - status (opcional): "development" muestra el cartel "En desarrollo" junto al titulo.
   - images (opcional): fotos extra. Con video se muestran en mosaico debajo del video y el texto no continua
     por debajo; sin video, las fotos son el medio principal (mosaico si son varias).
   Los textos (titulo y descripcion) estan en SECTIONS_COPY[idioma].projects.items, con el mismo id. */
export const PROJECTS = [
    {
        id: "a-lot-of-bullets",
        period: { start: 2024, current: true },
        status: "development",
        video: { type: "file", src: projectMedia("a-lot-of-bullets", "gameplay.webm") },
    },
    {
        id: "simulador-assistcargo",
        period: { start: 2026 },
        video: { type: "file", src: projectMedia("simulador-assistcargo", "demo.webm") },
        images: [1, 2, 3, 4].map((n) => projectMedia("simulador-assistcargo", `expo-panama-${n}.jpeg`)),
    },
    {
        id: "automatizador-ia",
        period: { start: 2026 },
        video: { type: "file", src: projectMedia("automatizador-ia", "demo.webm") },
    },
    {
        id: "catacombs-of-empire",
        period: { start: 2021, end: 2022 },
        video: { type: "file", src: projectMedia("catacombs-of-empire", "gameplay.webm") },
        poster: catacombs,
    },
    {
        id: "where-is-steven",
        period: { start: 2021, end: 2022 },
        video: { type: "file", src: projectMedia("where-is-steven", "gameplay.webm") },
        poster: steven,
    },
    {
        id: "lost-in-the-swamp",
        period: { start: 2021 },
        video: { type: "file", src: projectMedia("lost-in-the-swamp", "gameplay.webm") },
        poster: lost,
    },
];

export const PRIMARY_TECH = [
    { src: csharpLogo, alt: "C#", name: "C#" },
    { src: unityLogo, alt: "Unity", name: "Unity" },
    { src: gitLogo, alt: "Git", name: "Git" },
    { src: reactLogo, alt: "React", name: "React" },
];

export const SECONDARY_TECH = [
    { src: reaperLogo, alt: "Reaper", name: "Reaper" },
    { src: htmlLogo, alt: "HTML5", name: "HTML5" },
    { src: cssLogo, alt: "CSS3", name: "CSS3" },
    { src: blenderLogo, alt: "Blender", name: "Blender" },
];

export const SECTIONS_COPY = {
    es: {
        intro: {
            lead: "Soy desarrollador y diseñador de videojuegos. Trabajo con Unity y C# desde hace más de cuatro años y me especializo en llevar una idea desde el prototipo hasta un juego jugable y terminado.",
            body: "Combino programación, Inteligencia Artificial, game design y level design para desarrollar simulaciones y videojuegos completos.",
            featuredLabel: "Proyecto destacado",
            featuredTitle: "Lost in the Swamp",
        },
        miniTags: ["Shooter", "Puzzles", "Plataformero", "Pensamiento crítico", "Adaptabilidad"],
        about: {
            title: "Sobre mí",
            kicker: "Perfil",
            highlights: [
                "Soy Maximiliano Caneda, desarrollador y diseñador de videojuegos de Argentina. Hace más de cuatro años que trabajo con Unity y C#, llevando ideas desde el prototipo hasta juegos terminados y jugables. Trabajé en Games Station Studio, Lightning Vortex Technologies e Interlude.gg, y como investigador experimental en el Laboratorio LIVE de la UAI.",
                "Desarrollé los juegos Lost in the Swamp, Where is Steven? y Catacombs of Empire, y mecánicas para Heroes of Valhalla y Grow Empire Rome. En Heroes of Valhalla hice el sistema de habilidades automatizado. Además, tengo inglés técnico, lo que me permite trabajar con documentación, herramientas y equipos internacionales.",
            ],
            more: [
                "Tengo 25 años. Me gradué como Licenciado en Producción de Simuladores y Videojuegos en la Universidad Abierta Interamericana (UAI) con un promedio de 8.70, y me recibí de Técnico en Programación como Desarrollador Full Stack en la EEST N° 5 “John F. Kennedy”. Mi tesis se tituló “El bajo nivel competitivo genera respuestas emocionales agresivas en jugadores”.",
                "En Games Station Studio, además del sistema de habilidades, refactoricé y optimicé código legacy, corregí bugs, hice testing y documentación, y reparé herramientas internas del equipo, trabajando junto a las áreas de arte y game design.",
            ],
            work: "Trabajé durante 1 año en la empresa de juegos NFT ",
            workSpan: ", donde realicé 3 juegos con total libertad creativa junto a un equipo de Francia, Uruguay y Argentina. Como estudiante, participé activamente en el ",
            workLab: "Laboratorio de videojuegos experimentales de la UAI",
            workEnd: " entre 2020 y 2024, desarrollando prototipos con mecánicas experimentales.",
            closing: [
                "Trabajo con patrones de diseño como State y Facade, POO, Clean Code y metodologías ágiles, y me muevo con soltura en todo el ciclo de un juego: prototipo, gameplay, UI/UX, testing, optimización y builds.",
                "En 2026 completé la capacitación en Desarrollo Full Stack con React.js en Talento Tech, para combinar programación, diseño y desarrollo de sistemas interactivos tanto en videojuegos como en aplicaciones web.",
            ],
            showMore: "Ver más",
            showLess: "Retraer",
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
                    details: [
                        "Me recibí como Desarrollador Full Stack.",
                        "Base sólida en algoritmos, estructuras de datos y desarrollo de software.",
                    ],
                },
                {
                    period: "2007 - 2018",
                    title: "Educación en inglés",
                    details: [
                        "Me permite trabajar con documentación técnica, pipelines y referencias de programación internacionales.",
                    ],
                },
                {
                    period: "2026",
                    title: "Desarrollo Full Stack con React.js",
                    place: "Capacitación · Talento Tech",
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
                    place: "Unity Developer",
                    details: [
                        "Desarrollé mecánicas para los juegos Heroes of Valhalla y Grow Empire Rome.",
                        "Refactorización de código, optimización, corrección de bugs, testing, documentación y reparación de herramientas para el desarrollo legacy.",
                        "Desarrollo en C# usando patrones de diseño y prácticas variadas, en contacto con distintas disciplinas de arte y game design.",
                    ],
                },
                {
                    period: "2020 - 2024",
                    title: "Laboratorio LIVE - UAI",
                    place: "Investigador experimental",
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
        skills: {
            title: "Aptitudes",
            kicker: "Stack",
            intro: "Estas son algunas de las tecnologías las cuales uso.",
            secondaryTitle: "Conocimientos secundarios",
            secondaryIntro: "Estas son algunas de las tecnologías de las que tengo conocimientos.",
        },
        projects: {
            title: "Proyectos",
            kicker: "Catálogo",
            intro: "Juegos completos desarrollados para clientes y como pruebas técnicas.",
            present: "Actualidad",
            timelineLabel: "Línea de tiempo de proyectos",
            inDevelopment: "En desarrollo",
            next: "Siguiente proyecto",
            prev: "Proyecto anterior",
            items: [
                {
                    id: "a-lot-of-bullets",
                    title: "A lot of bullets",
                    description: [
                        "Un shooter roguelite en 2D en el que el orden de los efectos de tus balas transforma a la bala misma. Los efectos funcionan como una cadena: cada uno actúa sobre el resultado del anterior y el jugador puede reordenarlos libremente. Tus propias balas no te dañan, pero las explosiones, los charcos y las minas que generan sí, así que una combinación descontrolada puede terminar con tu partida. Lo creé junto a mi compañero Guido Martin Gallego Paolucci y ganó el premio a la idea original en 2024.",
                        "En este proyecto diseñé la narrativa, nuevos personajes y mecánicas, creé efectos y un sistema de efectos visuales, y me encargué de la UI/UX. Además, junto a una artista, buscamos una dirección de arte poco explorada que le diera una identidad propia: un estilo cross-hatching, urbano y sketchy.",
                    ],
                },
                {
                    id: "simulador-assistcargo",
                    title: "Simulador AssistCargo",
                    description: [
                        "Simulador de realidad virtual que desarrollé en Unity, compatible con Meta Quest 2, Quest 3 y Quest 3S. Muestra los beneficios y las características de contratar a AssistCargo para asegurar los contenedores desde la salida hasta la llegada.",
                        "En la simulación, el usuario toma el rol del chofer y, además, puede ver el interior del contenedor durante el viaje y en el punto de llegada.",
                        "Fue desarrollado para la exposición sobre seguridad en el rubro marítimo realizada en Panamá.",
                    ],
                },
                {
                    id: "automatizador-ia",
                    title: "Automatizador IA",
                    description: [
                        "Desarrollé en Python un programa para automatizar la rendición de gastos de la empresa Satelital, que necesitaba agilizar la verificación de los comprobantes y de los registros presentados.",
                        "Mediante IA, el programa analizaba las imágenes de los comprobantes, extraía los datos clave y verificaba que coincidieran con lo registrado en cada rendición. La idea era que la IA detectara errores mínimos y errores humanos que suelen pasar inadvertidos.",
                        "La IA también comprobaba que la descripción de cada gasto correspondiera a su concepto. Según el concepto, el gasto se asignaba a una cuenta corriente y se generaba un extracto de cuánto se había gastado en cada cuenta. Así, todo quedaba listo para entregar a las áreas que habilitan los pagos.",
                    ],
                },
                {
                    id: "lost-in-the-swamp",
                    title: "Lost in the Swamp",
                    description: [
                        "Comenzó como una prueba técnica para ingresar a Interlude: un juego de supervivencia desarrollado en Unity en 4 días, con la única condición de que durara alrededor de 10 minutos de gameplay.",
                        "A la empresa le gustó la premisa y me pidió expandirlo y sumarlo a su carrera de juegos, en la que terminar cada juego en tiempo récord daba acceso al siguiente y completar la carrera otorgaba una criptomoneda.",
                    ],
                },
                {
                    id: "where-is-steven",
                    title: "Where is Steven?",
                    description: [
                        "Juego de puzzles desarrollado en Unity en 10 días para la empresa Interlude, con total libertad creativa.",
                        "También formaba parte de la carrera de juegos de Interlude: terminarlo en tiempo récord permitía avanzar a los siguientes juegos, y completar la carrera otorgaba una criptomoneda.",
                    ],
                },
                {
                    id: "catacombs-of-empire",
                    title: "Catacombs of Empire",
                    description: [
                        "Juego desarrollado en Unity en un lapso de dos semanas para la empresa Interlude. Formaba parte de una carrera de juegos: terminarlo en tiempo récord permitía pasar a los siguientes, y quien completaba la carrera entera recibía una criptomoneda.",
                        "Tuve libertad creativa para crear el juego base y sus 4 mapas extra.",
                    ],
                },
            ],
        },
    },
    en: {
        intro: {
            lead: "I am a video game developer and designer. I have been working with Unity and C# for over four years and I specialise in taking an idea from prototype to a finished, playable game.",
            body: "I combine programming, Artificial Intelligence, game design and level design to develop complete simulations and video games.",
            featuredLabel: "Featured project",
            featuredTitle: "Lost in the Swamp",
        },
        miniTags: ["Shooter", "Puzzles", "Platformer", "Critical thinking", "Adaptability"],
        about: {
            title: "About me",
            kicker: "Profile",
            highlights: [
                "I am Maximiliano Caneda, a video game developer and designer from Argentina. I have been working with Unity and C# for over four years, taking ideas from prototype to finished, playable games. I have worked at Games Station Studio, Lightning Vortex Technologies and Interlude.gg, and as an experimental researcher at the UAI LIVE Lab.",
                "I built the games Lost in the Swamp, Where is Steven? and Catacombs of Empire, and developed mechanics for Heroes of Valhalla and Grow Empire Rome. For Heroes of Valhalla I built the automated skill system. I also have technical English, which lets me work with documentation, tools and international teams.",
            ],
            more: [
                "I am 25 years old. I hold a Bachelor’s degree in Simulation and Video Game Production from Universidad Abierta Interamericana (UAI), graduating with a GPA of 8.70, and I graduated as a Programming Technician, qualified as a Full Stack Developer, from EEST N° 5 “John F. Kennedy”. My thesis was titled “Low competitive levels generate aggressive emotional responses in players.”",
                "At Games Station Studio, besides the skill system, I refactored and optimised legacy code, fixed bugs, handled testing and documentation, and repaired the team’s internal tools, working alongside the art and game design teams.",
            ],
            work: "I worked for 1 year at the NFT game company ",
            workSpan: ", where I created 3 games with full creative freedom alongside a team from France, Uruguay and Argentina. As a student, I actively participated in the ",
            workLab: "UAI experimental video game lab",
            workEnd: " between 2020 and 2024, building prototypes with experimental mechanics.",
            closing: [
                "I work with design patterns such as State and Facade, OOP, Clean Code and agile methodologies, and I am comfortable across the whole life cycle of a game: prototyping, gameplay, UI/UX, testing, optimisation and builds.",
                "In 2026 I completed the Full Stack Development with React.js training at Talento Tech, to combine programming, design and interactive system development across both games and web applications.",
            ],
            showMore: "Show more",
            showLess: "Show less",
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
                    details: [
                        "Graduated as a Full Stack Developer.",
                        "Solid grounding in algorithms, data structures and software development.",
                    ],
                },
                {
                    period: "2007 - 2018",
                    title: "English education",
                    details: [
                        "Lets me work comfortably with technical documentation, pipelines and international programming resources.",
                    ],
                },
                {
                    period: "2026",
                    title: "Full Stack development with React.js",
                    place: "Training · Talento Tech",
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
                    place: "Unity Developer",
                    details: [
                        "Developed mechanics for the games Heroes of Valhalla and Grow Empire Rome.",
                        "Code refactoring, optimisation, bug fixing, testing, documentation and repair of legacy development tools.",
                        "C# development using design patterns and varied practices, working alongside different art and game design disciplines.",
                    ],
                },
                {
                    period: "2020 - 2024",
                    title: "LIVE Lab - UAI",
                    place: "Experimental researcher",
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
        skills: {
            title: "Skills",
            kicker: "Stack",
            intro: "These are some of the technologies I use.",
            secondaryTitle: "Secondary knowledge",
            secondaryIntro: "These are some of the technologies I have experience with.",
        },
        projects: {
            title: "Projects",
            kicker: "Catalogue",
            intro: "Complete games built for clients and as technical tests.",
            present: "Present",
            timelineLabel: "Projects timeline",
            inDevelopment: "In development",
            next: "Next project",
            prev: "Previous project",
            items: [
                {
                    id: "a-lot-of-bullets",
                    title: "A lot of bullets",
                    description: [
                        "A 2D roguelite shooter where the order of your bullet effects reshapes the bullet itself. Effects work as a chain: each one acts on the result of the one before it, and players can reorder them freely. Your own bullets can't hurt you, but the explosions, puddles and mines they create can, so an out-of-control combination can end your run. I created it with my teammate Guido Martin Gallego Paolucci, and it won the Original Idea award in 2024.",
                        "On this project I designed the narrative and new characters and mechanics, created effects and a visual effects system, and handled the UI/UX. I also worked with an artist to find an unusual, little-explored art direction that gave the game its own identity: a cross-hatched, urban, sketchy style.",
                    ],
                },
                {
                    id: "simulador-assistcargo",
                    title: "AssistCargo Simulator",
                    description: [
                        "A virtual reality simulator I developed in Unity, compatible with Meta Quest 2, Quest 3 and Quest 3S. It showcases the benefits and features of hiring AssistCargo to secure containers from departure to arrival.",
                        "In the simulation, the user takes on the role of the truck driver and can also see inside the container during the journey and at the destination.",
                        "It was developed for an exhibition on maritime security held in Panama.",
                    ],
                },
                {
                    id: "automatizador-ia",
                    title: "AI Automator",
                    description: [
                        "I developed a Python program to automate expense reporting for the company Satelital, which needed to speed up the verification of receipts and expense records.",
                        "Using AI, the program analysed receipt images, extracted the key data and checked that it matched the records submitted with each expense report. The goal was for the AI to catch small mistakes and human errors that are easy to overlook.",
                        "The AI also checked that each expense description matched its category. Depending on the category, the expense was assigned to a current account and a statement was generated showing how much had been spent on each account, leaving everything ready to hand over to the departments that approve payments.",
                    ],
                },
                {
                    id: "lost-in-the-swamp",
                    title: "Lost in the Swamp",
                    description: [
                        "It started as a technical admission test for Interlude: a survival game developed in Unity in 4 days, with the only condition being around 10 minutes of gameplay.",
                        "The company liked the premise and asked me to expand it and add it to their game race, where finishing each game in record time unlocked the next one and completing the race earned a cryptocurrency.",
                    ],
                },
                {
                    id: "where-is-steven",
                    title: "Where is Steven?",
                    description: [
                        "A puzzle game developed in Unity in 10 days for Interlude, with full creative freedom.",
                        "It was also part of Interlude's game race: finishing it in record time let players move on to the next games, and completing the race earned a cryptocurrency.",
                    ],
                },
                {
                    id: "catacombs-of-empire",
                    title: "Catacombs of Empire",
                    description: [
                        "A game developed in Unity over two weeks for Interlude. It was part of a game race: finishing it in record time unlocked the next games, and completing the whole race earned a cryptocurrency.",
                        "I had full creative freedom to create the base game and its 4 extra maps.",
                    ],
                },
            ],
        },
    },
};

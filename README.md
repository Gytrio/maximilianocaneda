# Portfolio — Maximiliano Caneda

Portfolio personal de Maximiliano Caneda, desarrollador y diseñador de videojuegos (Unity / C#).
Hecho con **React 19 + Vite 7**, sin dependencias de UI: la navegación es un timeline de puntos y
cada sección se abre con una transición propia.

Publicado en GitHub Pages bajo el base `/maximilianocaneda/` (ver `vite.config.js`).

## Comandos

```bash
npm install      # instalar dependencias
npm run dev      # servidor de desarrollo en http://localhost:5173
npm run build    # build de produccion en dist/
npm run preview  # servir dist/ localmente para verificar el build
npm run lint     # eslint
npm run publish  # install + build + deploy a GitHub Pages (gh-pages -d dist)
```

## Estructura

```
index.html                  Documento raiz (favicon, meta, punto de montaje)
vite.config.js              Config de Vite + base de GitHub Pages

public/                     Archivos servidos tal cual, sin pasar por el bundler
  favicon.ico
  media/projects/<id>/      Medios pesados de cada proyecto (videos y fotos).
                            <id> coincide con el id del proyecto en src/content/sections.js

src/
  main.jsx                  Punto de entrada de React
  App.jsx                   Orquesta el layout, el idioma y las transiciones entre secciones

  assets/                   Imagenes que pasan por el bundler (hasheadas en el build)
    profile/                Foto de perfil
    projects/               Posters / capturas de proyectos
    tech/                   Logos de tecnologias

  components/               Componentes reutilizables, uno por carpeta con su CSS al lado
    BranchGlitch/           Glitch que ramifica desde la foto al hacer click
    IdentityPanel/          Hero: foto, nombre, roles, contacto y franja negra
    RootGlitch/             Raiz circular de fondo (hero y secciones), centrada en foto o franja
    SectionStage/           Contenedor que abre y cierra cada seccion
    StripGlitch/            Glitch que barre la franja negra
    Timeline/               Timeline de puntos (variantes area blanca y franja)

  sections/                 Una seccion del timeline por archivo
    registry.js             Registro de secciones (id, label, componente)
    SobreMi.jsx
    Proyectos.jsx
    HabilidadesTecnicas.jsx
    ExperienciaLaboral.jsx
    EstudiosCapacitaciones.jsx
    RecordList.jsx          Lista compartida por Experiencia y Estudios
    sections.css            Estilos comunes de las secciones
    projects/               Piezas internas de la seccion Proyectos

  content/                  Todo el texto y los datos, separados de la vista
    sections.js             Proyectos, stack y copy de las secciones (es/en)
    ui.js                   Copy de la interfaz y datos de contacto (es/en)

  hooks/                    Hooks de scroll, transiciones, typewriter y reduced motion
  config/motion.js          Duraciones y curvas de animacion compartidas
  styles/
    global.css              Reset, variables CSS, layout raiz y modal de idioma
    dotGlitch.css           Efecto de glitch compartido por los puntos

docs/
  arquitectura-portfolio.md Contrato de arquitectura: flujo, capas, variables y duenos de cada archivo
```

## Donde va cada archivo nuevo

| Que es | Donde va |
|---|---|
| Video o foto pesada de un proyecto | `public/media/projects/<id-del-proyecto>/` |
| Poster, logo o imagen chica | `src/assets/` (en la subcarpeta que corresponda) |
| Texto visible en pantalla | `src/content/sections.js` o `src/content/ui.js`, nunca en el JSX |
| Estilo de un componente | Al lado del componente, mismo nombre |
| Estilo usado por mas de una pieza | `src/styles/` |

Los nombres de archivos y carpetas van en **kebab-case y sin espacios ni acentos**, para que las URLs
no necesiten escaparse.

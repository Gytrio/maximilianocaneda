# Arquitectura: vista principal y navegación por timeline

Contrato compartido entre todas las piezas. Cada pieza solo conoce este documento, los archivos
compartidos listados abajo y sus propios archivos. **Nadie edita archivos de otra pieza.**

## Flujo

1. **Hero**: foto, nombre y roles centrados sobre fondo blanco.
2. **Scroll** (scrubbed, ligado al scroll): el bloque de identidad se desplaza a la izquierda y se forma una
   franja negra fija cuyo ancho es el de la foto (`--photo-w`). Al llegar al final (fase `split`) aparece el
   timeline en el área blanca: 5 dots con pop elástico + línea vertical, luego los 5 textos escalonados
   (fade + desplazamiento izquierda→derecha).
3. **Click** en un dot/texto (excepto "Proyectos", que no hace nada): el dot crece abruptamente hasta cubrir
   el área blanca (sin tapar la franja), funde a blanco, y entra el contenido de la sección desde el borde de
   la franja con fade + desplazamiento. Todo el texto de la sección se escribe en paralelo (máquina de escribir
   ultrarrápida, todos los nodos a la vez, tope `MOTION.typeMax`).

## Estructura de archivos y dueños

```
src/
  App.jsx                                   Arquitecto  (orquesta todo)
  styles/global.css                         Arquitecto  (reset, variables, layout raíz, modal idioma)
  config/motion.js                          Arquitecto  (COMPARTIDO, solo lectura)
  content/ui.js                             Arquitecto  (COMPARTIDO, solo lectura)
  sections/registry.js                      Arquitecto  (COMPARTIDO, solo lectura)
  hooks/usePrefersReducedMotion.js          Arquitecto  (COMPARTIDO, solo lectura)
  hooks/useScrollPhase.js                   Agente HOOKS
  hooks/useSectionTransition.js             Agente HOOKS
  hooks/useTypewriter.js                    Agente HOOKS
  components/IdentityPanel/IdentityPanel.jsx + IdentityPanel.css      Agente IDENTIDAD
  components/Timeline/Timeline.jsx + TimelineItem.jsx + Timeline.css  Agente TIMELINE
  components/SectionStage/SectionStage.jsx + SectionStage.css         Agente STAGE
  components/StripGlitch/StripGlitch.jsx + StripGlitch.css            Agente GLITCH
  components/BranchGlitch/BranchGlitch.jsx + BranchGlitch.css         Agente GLITCH
  components/RootGlitch/RootGlitch.jsx + RootGlitch.css               Agente GLITCH
  content/sections.js                                                  Agente SECCIONES
  sections/SobreMi.jsx, Proyectos.jsx, HabilidadesTecnicas.jsx,
           ExperienciaLaboral.jsx, EstudiosCapacitaciones.jsx,
           sections.css                                                Agente SECCIONES
```

## Variables CSS globales (definidas en `src/styles/global.css` por el Arquitecto)

| Variable | Valor | Uso |
|---|---|---|
| `--photo-w` | `clamp(200px, 22vw, 300px)`; `38vw` bajo 720px | ancho de la foto = ancho de la franja negra |
| `--scroll-p` | `0`..`1`, escrita en `document.documentElement` por `useScrollPhase` | progreso hero→split |
| colores | `--bg` `#fff`, `--ink` `#0f0f14`, `--dark` `#0b0b0f`, `--muted`, `--line`, `--accent` `#e11d3f` | ya existentes |
| fuentes | `Poppins` (títulos), `Inter` (texto), `JetBrains Mono` (detalles) | ya cargadas |

La scrollbar del documento está oculta. El documento tiene exactamente 1 viewport de recorrido de scroll
con scroll-snap en 0 y en el final.

## Layout raíz (App.jsx, Arquitecto)

```
<IdentityPanel/>                 position: fixed, inset 0, z-index 5. Es la capa de FONDO: pinta el blanco de la pagina,
                                 la franja negra y la identidad (asi mix-blend-mode funciona dentro de su contexto).
<div class="workspace" ref>      position: fixed; top/right/bottom 0; left: var(--photo-w); overflow: hidden; z-index 10;
                                 fondo transparente; pointer-events: none (sus hijos activan pointer-events: auto
                                 solo cuando son interactivos). Nunca se superpone a la franja negra.
   <Timeline/>                   ocupa todo el workspace
   <SectionStage>{<Seccion language/>}</SectionStage>   ocupa todo el workspace, encima del Timeline
</div>
<main class="scroll-runway">     2 bloques de 100vh con scroll-snap-align: start (solo da recorrido de scroll)
```

Mientras una sección está abierta (status !== "idle") el Arquitecto bloquea el scroll del documento; el
scroll ocurre dentro del panel de la sección.

## Contratos

### `config/motion.js` (compartido)
`MOTION` (duraciones ms), `EASING` (curvas), `SCROLL` (`enterSplit` 0.98, `leaveSplit` 0.9). No hardcodear
duraciones: importarlas y, si se usan en CSS, pasarlas como custom properties inline
(por ejemplo `style={{ "--dot-pop": MOTION.dotPop + "ms" }}`).

### `content/ui.js` (compartido)
`UI[language]` con `name`, `roles[]`, `scrollHint`, `timelineLabel`, `back`, `contact{email, linkedin, copy, copied}`,
`toggleLabel`, `languageModal{...}`. `language` es siempre `"es"` o `"en"`.

### `hooks/usePrefersReducedMotion.js` (compartido)
`usePrefersReducedMotion(): boolean`.

### `hooks/useScrollPhase.js` — Agente HOOKS
```js
const phase = useScrollPhase({ enabled }); // "hero" | "split"
```
- Progreso `p = clamp(scrollY / (scrollHeight - innerHeight), 0, 1)`; si `enabled` es false, `p = 0`.
- Escribe `p` en `document.documentElement.style` como `--scroll-p` (número sin unidad, 4 decimales) **sin
  re-renderizar React** (listener pasivo + requestAnimationFrame). Solo hace `setState` cuando cambia la fase.
- Histéresis: pasa a `"split"` cuando `p >= SCROLL.enterSplit`; vuelve a `"hero"` cuando `p <= SCROLL.leaveSplit`.
- Recalcula en `resize`. Limpia listeners/rAF al desmontar. Al desmontar deja `--scroll-p` en 0.

### `hooks/useSectionTransition.js` — Agente HOOKS
```js
const { status, activeId, origin, dotSize, open, close } = useSectionTransition();
// status: "idle" | "expanding" | "whiteout" | "entering" | "open" | "closing"
open(id, { origin: { x, y }, dotSize }) // origin relativo al workspace, en px. Ignorado si status !== "idle".
close()                                 // solo desde "entering" u "open".
```
- `open`: `expanding` (MOTION.expand) → `whiteout` (MOTION.whiteout) → `entering` (MOTION.contentIn) → `open`.
- `close`: `closing` (MOTION.closing) → `idle`; `activeId`, `origin`, `dotSize` vuelven a `null` al llegar a `idle`.
- Con reduced motion: `open` va directo a `"open"`, `close` directo a `"idle"`.
- Timers limpiados al desmontar y al encadenar; seguro bajo `StrictMode`. `open`/`close` estables (`useCallback`).

### `hooks/useTypewriter.js` — Agente HOOKS
```js
useTypewriter(containerRef, { run, runKey });
```
- Cuando `run` pasa a `true` (o cambia `runKey` con `run` true): recorre con `TreeWalker(SHOW_TEXT)` todos los
  nodos de texto bajo `containerRef.current` (omite los de solo espacios y los que estén dentro de
  `[data-typewriter="off"]`), guarda el texto original y los vacía **en `useLayoutEffect`** (sin parpadeo del texto completo).
- **Un único loop `requestAnimationFrame` para todos los nodos, todos arrancan a la vez (paralelo, nunca secuencial).**
  Duración de cada nodo = `min(MOTION.typeMax, largo * MOTION.typeMsPerChar)`; en cada frame
  `nodo.nodeValue = original.slice(0, ceil(largo * min(1, t / duracion)))`.
- Solo modifica `nodeValue` (nunca agrega/quita nodos: React es dueño del DOM). Si React cambió un nodo mientras
  tanto (`nodeValue !== ultimoValorEscrito`), lo suelta y no lo vuelve a tocar.
- Cleanup: cancela el rAF y restaura el texto original de los nodos que siguen con el último valor escrito.
- Con reduced motion no hace nada.

### `components/IdentityPanel/IdentityPanel.jsx` — Agente IDENTIDAD
```jsx
<IdentityPanel language="es" phase="hero" onToggleLanguage={fn} />
```
- Capa fija a pantalla completa con: la **franja negra** (izquierda, ancho `--photo-w`, se forma con
  `transform: scaleX(var(--scroll-p))` desde el borde izquierdo), el **bloque de identidad** (foto
  `src/assets/profile/foto-perfil.jpg` con ancho exacto `--photo-w`, nombre, roles), una **pista de scroll** en hero y un
  **pie de contacto** en split (LinkedIn, copiar correo, botón de idioma).
- Todo el movimiento hero→sidebar se calcula en CSS con `calc()` sobre `var(--scroll-p)` (sin estado React por frame),
  animando solo `transform`/`opacity`. En `p = 1` la foto queda pegada arriba a la izquierda, ocupando todo el ancho de
  la franja, con nombre y roles debajo, dentro de la franja.

### `components/Timeline/Timeline.jsx` — Agente TIMELINE
```jsx
<Timeline
  items={[{ id, label, interactive }]}   // ya resueltos al idioma, en orden
  revealed={bool}                         // true cuando phase === "split"
  covered={bool}                          // true mientras una sección lo tapa
  label={UI[lang].timelineLabel}
  onSelect={(id, dotElement) => {}}       // solo se llama para items interactive
/>
```
- Se reproduce la secuencia (pop de dots + línea, luego textos escalonados) cada vez que pasa a estar visible
  (`revealed && !covered`). Al dejar de estar `revealed` se oculta con un fade rápido. Con `covered` se oculta al instante.
- Cada item es un `<button>` que contiene dot + texto. Items `interactive: false` llevan `onClick` vacío explícito.

### `components/SectionStage/SectionStage.jsx` — Agente STAGE
```jsx
<SectionStage status={status} activeId={id} origin={{x,y}} dotSize={px} backLabel={UI[lang].back} onClose={close}>
  <SeccionActiva language={lang} />
</SectionStage>
```
- `idle`: no pinta nada interactivo (`pointer-events: none`).
- `expanding`: círculo negro centrado en `origin` crece hasta cubrir el workspace.
- `whiteout`: capa blanca debajo + el círculo funde a transparente.
- `entering`/`open`: panel con `children`, entra desde el borde izquierdo del workspace; corre `useTypewriter` sobre el panel.
- `closing`: el panel sale con fade. Botón "Volver" y tecla Escape llaman `onClose` en `open`.

### `components/StripGlitch/StripGlitch.jsx` — Agente GLITCH
```jsx
<StripGlitch phase={phase} />
```
- Capa fija propia (App la renderiza entre IdentityPanel y workspace): `left 0; top 0; bottom 0; width var(--photo-w);
  z-index 6; pointer-events none; overflow hidden`. Queda encima de la franja, la foto y el pie, por debajo del workspace.
- Cada vez que `phase` pasa de `"hero"` a `"split"` reproduce una vez (MOTION.stripGlitch) un glitch que nace en la
  posicion de la foto (arriba de la franja) y baja hasta el borde inferior. Fuera de eso no pinta nada.

### Llegada a la franja (compartido por IDENTIDAD y GLITCH)
El mismo disparador (`phase` pasa de `"hero"` a `"split"`) arranca a la vez la sacudida de la identidad
(MOTION.arrivalShake, en IdentityPanel) y el glitch de la franja (MOTION.stripGlitch, en StripGlitch).

### Secciones — Agente SECCIONES
Cada componente de `src/sections/*.jsx`: `export default function X({ language })`, contenido en
`src/content/sections.js` (`SECTIONS_COPY[language].<seccion>`), estilos en `sections.css` con clases prefijadas
`sec-`. Sin animaciones propias: el Stage anima la entrada y el texto.

## Reglas comunes
- React 19 + Vite, JS (no TS). Comentarios en español, sin tildes, estilo del repo (comentario corto sobre la función).
- Animar solo `transform` y `opacity`.
- Respetar `prefers-reduced-motion` (CSS `@media` + `usePrefersReducedMotion`).
- Sin dependencias nuevas.
- Verificar con `npx eslint <tus archivos>`. No correr `npm run build` ni el dev server: otras piezas se escriben en paralelo.

---

## Iteracion 3 (prevalece sobre lo anterior donde contradiga)

### Flujo nuevo
- Al entrar a una seccion aparece un **timeline en la franja negra**, debajo de foto y roles, en blanco, con las
  mismas animaciones de entrada (gota, pop, linea, textos escalonados). Al volver al timeline del area blanca
  desaparece **a la inversa** (textos de abajo hacia arriba, luego dots y linea).
- Click en un item del timeline de la franja con una seccion abierta: **cambio de seccion**. El circulo negro nace
  en el dot de la franja (el origen queda a la izquierda del workspace, x negativo) y se ve emerger desde el borde de
  la franja; cubre la seccion actual, funde a blanco y entra la nueva.
- Hover sobre foto/texto: escala en su lugar (sin desplazarse) y solo en fase `hero`.
- Click sobre foto/texto en `hero`: ademas del scroll, un **glitch de ramificacion** que viaja pegado a la foto.
- Glitch de la franja: barrido desde el borde superior de la franja hasta el inferior.

### `useSectionTransition` (Agente HOOKS)
```js
const { status, activeId, displayId, switching, origin, dotSize, open, close } = useSectionTransition();
```
- `open(id, opts)` valido desde `"idle"` (apertura normal) **y desde `"open"` si `id !== activeId`** (cambio).
- En un cambio: `activeId` pasa a ser el nuevo id al instante; `switching` es `true` desde el click hasta llegar a
  `"open"`; `displayId` (la seccion que el Stage debe pintar) es el id **anterior** durante `"expanding"` del cambio
  y el nuevo desde `"whiteout"` en adelante. Fuera de un cambio `displayId === activeId`.
- Mismos tiempos (expand → whiteout → entering → open). Con reduced motion el cambio va directo a `"open"`.

### `SectionStage` (Agente STAGE)
```jsx
<SectionStage status activeId displayId switching origin dotSize backLabel onClose>{seccion de displayId}</SectionStage>
```
- Orden de capas: blanco, panel, **circulo arriba de todo** (para poder cubrir la seccion vieja).
- Cambio (`switching`): en `"expanding"` sigue visible el panel viejo (estatico, con capa blanca debajo) y el circulo
  crece encima; en `"whiteout"` el panel viejo ya no se pinta; desde `"entering"` igual que una apertura normal.
- Si `origin.x < 0` (el dot esta en la franja), la escala inicial hace que el borde del circulo arranque justo en el
  borde izquierdo del workspace: radio inicial `|x| + dotSize/2`. Asi se ve nacer desde la franja sin demora.
- `useTypewriter(..., { runKey: displayId })`.

### `Timeline` (Agente TIMELINE)
```jsx
<Timeline items revealed covered label onSelect variant="workspace" | "strip" exit="fade" | "reverse" activeId />
```
- `variant="strip"`: dots, linea, gota, anillos y textos en blanco (`#fff`), hover en `var(--accent)`, tamanos
  compactos para el ancho de la franja; ocupa todo su contenedor (lo provee IdentityPanel) y se alinea arriba.
- `exit="reverse"`: al pasar `revealed` de true a false reproduce la entrada al reves (duraciones por
  `MOTION.exitScale`) y recien entonces queda oculto. `exit="fade"` es el comportamiento actual.
- `activeId`: el item activo lleva `aria-current="page"` y el texto en `var(--accent)`.
- Defaults: `variant="workspace"`, `exit="fade"`, `activeId=null` (el timeline del area blanca no cambia).

### `IdentityPanel` (Agente IDENTIDAD)
```jsx
<IdentityPanel language phase onToggleLanguage slotActive>{timeline de la franja}</IdentityPanel>
```
- `children` se pinta en un **slot** dentro de la franja: debajo del bloque de texto (en `split`) y arriba del pie de
  contacto. El slot tiene `pointer-events: none` (los botones del Timeline activan los suyos).
- `slotActive`: mientras es true, si el slot no tiene alto suficiente (`--slot-min`, ~10.5rem) se recorta el alto de
  la foto (transicion MOTION.slotReserve sobre max-height, unica excepcion a transform/opacity).
- Monta `<BranchGlitch runKey={n} />` dentro de una capa que sigue a la foto, e incrementa `n` en cada click/Enter
  sobre foto o texto en `hero`.

### `BranchGlitch` (Agente GLITCH)
```jsx
<BranchGlitch runKey={0} />   // 0 = nunca; cada incremento reproduce una vez MOTION.branchGlitch
```
- Llena su contenedor (absolute inset 0), `overflow: visible`, `pointer-events: none`, `aria-hidden`.
- Estetica compartida con StripGlitch (fisuras blancas, trama roja `var(--accent)`, `steps()`), extraida a
  `src/components/StripGlitch/glitchLayers.css`.

### Iteracion 4
- `useScrollPhase({ enabled })` devuelve `{ phase, timelineRevealed }`. `timelineRevealed` se activa en
  `SCROLL.revealTimeline` (0.88) y se apaga en `SCROLL.hideTimeline` (0.8): el timeline del area blanca empieza a
  aparecer en el tramo final del recorrido, en paralelo al rebote y la sacudida de llegada. A menos de 1px del
  scroll maximo el progreso es exactamente 1.
- IdentityPanel: en `split` la foto conserva `tabIndex={-1}`. Quitarle la capacidad de foco mientras lo tiene hace
  que React la vuelva a enfocar al confirmar el render, y ese `focus()` cancela el scroll suave del click.

### Iteracion 5: seccion Proyectos
- Datos: `PROJECTS` en `src/content/sections.js` (periodo y medios, sin idioma) + `SECTIONS_COPY[lang].projects.items`
  (titulo y descripcion, mismo `id`). Periodo: `{ start, end }`, `{ start }` o `{ start, current: true }`.
- Medios: `video` (`{ type: "file", src }` o `{ type: "youtube", id }`), `poster`, `images[]`. Layout "flow" (el texto
  largo continua bajo el medio) salvo video + fotos, que usa "split" (texto en su columna, fotos en mosaico bajo el video).
- `src/sections/projects/`: `ProjectRow` (dot + tarjeta que entra al aparecer, alternando lado), `ProjectMedia`, CSS con
  container queries. `useRevealOnce` en `src/hooks/`. Proyectos ahora es `interactive: true` en el registro.

### Iteracion 6: Proyectos de a uno
- Un proyecto por vez (`ProjectSlide`): todos montados, solo el activo visible (`data-state` active/leaving/hidden),
  asi cada video conserva su punto. El boton "siguiente" (flecha abajo) revela el proximo dot con fade y cambia de
  proyecto; en el ultimo apunta hacia arriba y vuelve al primero. Los dots revelados permiten volver a cualquiera.
- Videos sin controles, en silencio y en bucle: se reproducen al aparecer, se pausan al cambiar y se reanudan al volver.
  YouTube (solo Lost in the Swamp, sin archivo propio) igual, via postMessage con `enablejsapi=1`.
- Orden: del mas reciente al mas viejo. Se quito `useRevealOnce` y `ProjectRow` (ya no hay scroll entre proyectos).

### Iteracion 7: navegacion de Proyectos
- `ProjectDot`: el activo emite ondas de goteo (`--prj-drop` = MOTION.dropInterval) y hace glitches cortos con
  espera, duracion, variante (1-3) y desplazamiento al azar via `data-glitch` / `--glitch-x` (sin re-render).
- Flechas arriba (anterior) y abajo (siguiente), deshabilitadas en los extremos (ya no vuelve al primero).
- Rueda, swipe y flechas del teclado cambian de proyecto en el borde del panel; un gesto (incluida la inercia del
  trackpad) cambia un solo proyecto. La seccion compensa `--panel-pad` para que el panel no quede apenas scrolleable.

### Iteracion 8
- Glitch de dots compartido: `useRandomGlitch(ref, { enabled, wait, length, variants, maxShift })` en `src/hooks/` y
  `src/styles/dotGlitch.css` (clase `.dot-glitch` dentro del elemento con `data-glitch`). Lo usan `ProjectDot` (solo el
  activo) y `TimelineItem` (todos los dots visibles, cada uno con su ritmo, mas espaciado: 1,4 a 5,2 s).
- Timeline de proyectos: todos los dots visibles desde el inicio (entrada escalonada, la linea crece entera).
- Proyectos: `status: "development"` muestra el cartel "En desarrollo" / "In development"; la descripcion puede ser
  una lista de parrafos.

### Iteracion 9
- Proyectos: el periodo va arriba del titulo (`.prj-head` en columna, `.prj-title-row` con titulo y cartel). Titulo de
  la seccion: "Proyectos" / "Projects".
- StripGlitch: ademas del barrido de llegada, rafagas espontaneas mientras se esta en la franja, con espera
  (`MOTION.stripBurstWait`) y duracion (`MOTION.stripBurstScale` x stripGlitch) al azar.
- IdentityPanel: el resorte de la inclinacion se integra en sub-pasos fijos de 8 ms y el angulo tiene tope; con un
  solo paso largo (cuadros lentos) la integracion divergia y la foto giraba sin control.

### Iteracion 10
- **Marco del timeline de la franja** (Agente VISUAL, `Timeline.jsx` + `Timeline.css`): el timeline de la franja
  negra queda rodeado por un rectangulo de bordes redondeados y borde blanco. Nodo `.tl-frame`, decorativo
  (`aria-hidden`, `pointer-events: none`), dentro de `.tl-nav` y absoluto con `inset: calc(var(--tl-frame-pad) * -1)`,
  asi mide exactamente el bloque de dots + textos. Solo en la variante strip; el timeline del area blanca no lleva
  marco. Se dibuja de arriba hacia abajo con `mask-image` (gradiente de borde suave, `mask-size: 100% 300%`,
  `mask-repeat: no-repeat`, animando `mask-position`) en `MOTION.stripFrameDraw`; en la salida inversa se retrae
  ultimo, con la duracion escalada por `MOTION.exitScale`. Diales: `--tl-frame-color`, `--tl-frame-w`,
  `--tl-frame-radius`, `--tl-frame-pad`, `--tl-frame-mask-solid`, `--tl-frame-mask-soft`.
- **Cadena de scroll entre secciones** (Agente LOGICA, `hooks/useSectionChainScroll.js` + `App.jsx`): desde el
  timeline del area blanca, un gesto hacia abajo abre la primera seccion interactiva del registro. Con una seccion
  abierta, el contenido de `.stage-panel` scrollea nativo; al llegar al borde y seguir acumulando mas de
  `SCROLL_CHAIN.threshold` pasa a la seccion siguiente (o a la anterior hacia arriba, y desde la primera cierra y
  vuelve al timeline). En la ultima seccion hacia abajo no hace nada. `SCROLL_CHAIN.cooldown` evita que un gesto
  salte dos secciones. Rueda, touch y teclado (`ArrowDown`/`PageDown`/`Space`, `ArrowUp`/`PageUp`); `Escape` sigue
  cerrando. Reutiliza `handleSelect` de `App.jsx`, por lo que el origen de la transicion sigue siendo el dot
  (el de la franja con una seccion abierta, el del workspace desde el timeline).
- **Contrato `data-chain-hold`**: una seccion que tenga navegacion interna propia en el borde del panel declara
  `data-chain-hold="up"` / `data-chain-hold="down"` en el control que la gobierna (el mismo nodo que lleva
  `disabled`). Mientras ese control exista habilitado, la cadena cede el gesto a la seccion. Lo usa `Proyectos`
  para recorrer los proyectos de a uno y pasar a la seccion siguiente solo en el ultimo.

### Iteracion 11: tema claro/oscuro y wipe circular del cambio

Son dos cosas que llegaron juntas: los tokens de tema (iteracion anterior, que quedo sin documentar) y el
wipe circular que acompana el cambio.

#### Tokens de tema (Arquitecto, `src/styles/global.css`)
- El tema vive en `document.documentElement` como `data-theme="light" | "dark"`, **siempre explicito**. A
  proposito no se pinta con `@media (prefers-color-scheme)`: el hook resuelve el sistema y escribe el
  atributo, asi la eleccion manual del visitante gana sin peleas de especificidad.
- `:root` trae el tema claro (los valores historicos) y `:root[data-theme="dark"]` lo redefine.
- Tokens que se invierten con el tema: `--bg`, `--bg-soft`, `--ink`, `--ink-soft`, `--muted`, `--line`,
  `--line-strong`, `--accent` (mas luminoso en oscuro, el `#e11d3f` vibra sobre fondo oscuro),
  `--accent-strong`, `--dark`, `--shadow-sm`, `--shadow`, `color-scheme`.
- `--ink-rgb`: componentes rgb de `--ink`. **Unico** modo de usar la tinta con alfa (`rgba(var(--ink-rgb), a)`):
  lo necesitan los glitch, que no pueden pasar por `color-mix` sin perder el `steps()`.
- `--on-ink`: texto o icono apoyado sobre una superficie pintada con `--ink` (botones invertidos).
- `--focus-ring`: anillo de foco sobre el fondo de la pagina (no sobre la franja).
- `--overlay`: velo del modal de idioma.
- **Franja negra (`--strip-*`)**: tokens propios, separados de `--bg`/`--ink`, para que la franja **NO se
  invierta** con el tema. En los dos temas es oscura con contenido blanco; solo cambia cuanto.
  `--strip-bg`, `--strip-ink`, `--strip-ink-rgb`, `--strip-line`, `--strip-line-strong`, `--strip-veil`,
  `--strip-frame`, y `--strip-edge` (hairline del borde derecho: transparente en claro, visible en oscuro,
  donde la franja y el workspace son las dos superficies oscuras y hay que separarlas).
- **Tiles de tecnologia (`--tile-*`)**: superficie clara en los dos temas, porque los iconos son imagenes y
  algunas (unity, csharp) son casi negras. No se filtran las imagenes: se conserva la superficie.
  `--tile-bg`, `--tile-line`, `--tile-line-strong`, `--tile-ink`.
- `--bg-light` / `--bg-dark`: fondo de pagina de cada tema, declarados **una sola vez** en `:root` y por eso
  legibles desde los dos. Los usa el wipe, que se pinta con el fondo del tema DESTINO mientras el vigente
  sigue siendo el otro (un elemento anidado con `data-theme` no redefine los tokens de `:root`). `--bg` es
  `var(--bg-light)` en claro y `var(--bg-dark)` en oscuro: una sola fuente de verdad.
- Ninguna propiedad de color se transiciona: el salto de tema es seco y lo tapa el wipe.

#### Script de `index.html` (Arquitecto)
Antes del primer pintado resuelve el tema (eleccion guardada en `portfolio-theme` y, si no hay, el sistema) y
escribe `data-theme`, para que no se vea un parpadeo del tema equivocado al recargar. `useTheme` hace la
misma cuenta y queda dueno del atributo desde que monta.

#### `hooks/useTheme.js` — Agente LOGICA
```js
const { theme, wipe, toggleTheme } = useTheme();
// theme: "light" | "dark"
toggleTheme(origin); // origin: { x, y, size } en px de VIEWPORT (centro del boton y su lado mayor), o undefined
// wipe: null | { x, y, size, to: "light" | "dark", phase: "wiping" | "fading" }
```
- Sigue al sistema en vivo mientras no haya eleccion; el primer `toggleTheme` crea la eleccion manual, que se
  guarda en `localStorage` (`portfolio-theme`) y gana sobre el sistema. `data-theme` se escribe en
  `useLayoutEffect`.
- Maquina del wipe: `wiping` durante `MOTION.themeWipe` -> en ese tick se cambia el tema **y** `phase` pasa a
  `"fading"` -> a los `MOTION.themeFade` ms `wipe` vuelve a null.
- Un toggle mientras hay uno en curso se **ignora** (candado por ref, leido en el momento del click, igual que
  `open` en `useSectionTransition` cuando `status !== "idle"`).
- Camino instantaneo, con `wipe` siempre en null, si hay `prefers-reduced-motion`, si no llego `origin`, o si
  el navegador no soporta Web Animations.
- Timers limpiados al desmontar; seguro bajo `StrictMode` (los timers solo nacen en el click, nunca en un efecto).
- `toggleTheme` es estable: el tema vigente y el reduced motion viven en refs.

#### `components/ThemeWipe/ThemeWipe.jsx` + `.css` — Agente CODIGO (jsx) / VISUAL (css)
```jsx
{wipe && <ThemeWipe wipe={wipe} />}   // App lo monta asi: ThemeWipe asume que wipe nunca es null
```
- Capa `.theme-wipe`: `position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 1000`. El
  1000 es el maximo del proyecto a proposito: tapa **todo**, incluidas la franja negra y el modal de idioma
  (999). No subir nada por encima.
- Mismo mecanismo que `SectionStage`, adaptado a viewport completo: `coverDiameter` (identica formula),
  `left = x - d/2`, `top = y - d/2`, y `transform: scale(size/d -> 1)` con Web Animations
  (`MOTION.themeWipe`, `EASING.abrupt`, `fill: "forwards"`). El fundido es `opacity` 1 -> 0 en
  `MOTION.themeFade`.
- El efecto de crecimiento tiene deps `[x, y, size]` **sin `phase`**: si volviera a correr en el fundido,
  cancelaria el `fill: forwards` del scale y destaparia la pantalla a mitad del cambio.
- Color del circulo por `data-to`: `var(--bg-dark)` o `var(--bg-light)`, el fondo del tema **destino**, para que
  al desvanecerse no haya salto. Nunca `var(--bg)`, que durante el wipe todavia es el tema viejo.
- `@media (prefers-reduced-motion: reduce)` lo oculta por completo, como red de seguridad: el hook ya evita
  montarlo.

#### `IdentityPanel` (Agente CODIGO)
El boton de tema (`.identity-panel__btn--theme`, en el pie de la franja) pasa en su `onClick` el centro y el
lado mayor del boton en coordenadas de viewport, igual que `handleSelect` de `App.jsx` con los dots. El icono
sol/luna y `aria-pressed` dependen de la prop `theme`, que el hook da vuelta en el instante del cambio real
(con la pantalla tapada): quedan sincronizados con lo que se ve, sin estado local.

#### Compromisos conocidos
- En el sentido oscuro->claro la franja negra queda tapada por el circulo blanco y vuelve a su negro durante
  los `MOTION.themeFade` ms del fundido (se la ve "lavada" un instante). Es consecuencia directa de tapar toda
  la pantalla con un solo color: la franja no se invierte con el tema, asi que ningun color del circulo puede
  coincidir a la vez con la pagina y con la franja. Es un fundido suave, no un salto.
- El wipe no reacciona a un `resize` durante sus `MOTION.themeWipe` ms: el diametro se calcula al montar. Si se
  agranda la ventana dentro de esa ventana de tiempo, puede quedar un borde sin tapar en el instante del cambio.

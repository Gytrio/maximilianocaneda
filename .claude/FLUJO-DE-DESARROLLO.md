# Flujo de desarrollo con agentes

Este archivo manda sobre como se desarrolla en este repo. El contrato de dominios y dueños de
archivos vive en `docs/arquitectura-portfolio.md`; aca esta el **proceso**.

## Principio

La sesion principal de chat **no escribe codigo**. Gestiona: entiende el pedido, lo traduce a
contratos y delega. Cada agente especialista escribe su parte una sola vez, completa y verificada
por el mismo, de modo que no haya que volver a revisar lo mismo en ciclos.

```
Usuario
  -> Sesion principal (gestion)
       -> ARQUITECTO            decide contratos, limites y reparto
            -> AGENTE LOGICA    hooks, maquinas de estado, eventos
            -> AGENTE VISUAL    CSS, animaciones, layout
            -> AGENTE CODIGO    componentes JSX, contenido, estructura
            -> AGENTE QA         lint + dev server + navegador, reporte final
```

## Roles

### ARQUITECTO (`.claude/agents/arquitecto.md`)
- Lee el pedido y `docs/arquitectura-portfolio.md`.
- Resuelve ambiguedades contra el codigo real antes de delegar (no pregunta lo que el codigo responde).
- Define: que archivos toca cada agente (**dueño unico por archivo**), que variables CSS y constantes
  de `src/config/motion.js` se comparten, y como se ve "listo".
- Escribe el mismo los contratos compartidos (`config/motion.js`, `styles/global.css`, `registry.js`)
  **antes** de lanzar a los especialistas, para que ninguno los edite en paralelo.
- Lanza los agentes en paralelo solo si sus conjuntos de archivos son disjuntos. Si se cruzan, los
  encadena.
- Al cerrar, actualiza `docs/arquitectura-portfolio.md` con la iteracion nueva.

### AGENTE LOGICA
Hooks (`src/hooks/*`), maquinas de estado, listeners, temporizadores, accesibilidad por teclado.
No toca CSS ni textos.

### AGENTE VISUAL
`*.css` y variables de animacion. Anima solo `transform`, `opacity`, `clip-path` y `mask`.
Respeta `prefers-reduced-motion`. No cambia logica de React.

### AGENTE CODIGO
Componentes `.jsx`, `src/content/*`, estructura del arbol. Mantiene la firma de props acordada.

### AGENTE QA
Corre `npx eslint`, levanta el dev server y verifica en el navegador los criterios de aceptacion que
dio el Arquitecto. Reporta con evidencia (consola, captura). **No arregla**: devuelve el defecto al
agente dueño del archivo.

## Reglas que todo agente cumple

1. React 19 + Vite, JS puro (no TS). Sin dependencias nuevas.
2. Comentarios en español **sin tildes**, cortos, arriba de lo que explican.
3. Animar solo `transform`, `opacity`, `clip-path`, `mask`. Cualquier otra propiedad se justifica en
   un comentario.
4. `prefers-reduced-motion`: `@media` en CSS y `usePrefersReducedMotion` en JS.
5. Duraciones y curvas **siempre** desde `src/config/motion.js`. Nunca numeros sueltos en CSS/JS.
6. Tocar unicamente los archivos asignados. Si hace falta otro, se reporta al Arquitecto.
7. Antes de cerrar: `npx eslint <archivos tocados>` sin errores.
8. No correr `npm run build` ni el dev server si hay agentes en paralelo: eso lo hace QA al final.

## Criterio de "listo"

Un trabajo se entrega cuando el agente dueño verifico su propia parte y QA confirmo los criterios de
aceptacion en el navegador. La sesion principal solo reporta el resultado al usuario.

## Contratos de seleccion (no renombrar sin avisar)

Estos selectores los usa la logica para encontrar nodos; cambiarlos rompe la navegacion:

- `[data-timeline-id="<id>"]` en cada boton del timeline, con `.tl-dot` adentro.
- `.stage-panel` es el contenedor que scrollea de la seccion abierta.
- `.workspace` es el marco de referencia de coordenadas de las transiciones.
- `data-chain-hold="up" | "down"` en un control de la seccion (el mismo nodo que lleva `disabled`): mientras
  exista habilitado, la cadena de scroll cede el gesto a la navegacion interna de esa seccion.

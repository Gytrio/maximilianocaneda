# maximilianocaneda — portfolio

React 19 + Vite, JS puro. Sin dependencias nuevas.

## Como se desarrolla aca

Leer **`.claude/FLUJO-DE-DESARROLLO.md`** antes de escribir codigo. Resumen:

- La sesion principal **delega cuando el pedido cruza dominios**. Si el cambio entra en **un solo
  archivo**, lo escribe y lo verifica ella misma: levantar un agente cuesta mas que el cambio.
- El **Arquitecto** define contratos y reparte archivos (dueño unico por archivo), y escribe el mismo
  los compartidos (`config/motion.js`, `styles/global.css`, `sections/registry.js`).
- **LOGICA** (`hooks/*`, `App.jsx`), **VISUAL** (`*.css`), **CODIGO** (`*.jsx`, `content/*`) y **QA**
  (lint, build, navegador) trabajan en paralelo solo si sus archivos no se cruzan.
- Dominios y dueños por archivo: `docs/arquitectura-portfolio.md`.

## Reglas duras

- Comentarios en español **sin tildes**, cortos.
- Animar solo `transform`, `opacity`, `clip-path`, `mask`.
- Duraciones y curvas siempre desde `src/config/motion.js`.
- Respetar `prefers-reduced-motion` (CSS `@media` + `usePrefersReducedMotion`).
- Verificar con `npx eslint <archivos>`.

## Comandos

- `npm run dev` (dev server, puerto 5173 — ver `.claude/launch.json`)
- `npm run build`
- `npm run lint`

# Herramientas de Claude Code del proyecto

Skills y agentes que Claude Code carga automáticamente al abrir este repositorio,
en cualquier máquina o sesión en la nube. Se copiaron al repositorio (en vez de
instalarse como plugins) para fijar la versión revisada, no depender de la red
y no instalar hooks que se ejecuten solos.

Aplican junto con la «Guía de identidad y calidad visual v1» (Documento Maestro,
Parte X): las herramientas ayudan a revisar, pero la ficha de identidad de cada
tema sigue siendo la fuente de las decisiones de diseño.

## Contenido

| Carpeta | Para qué | Origen (commit) | Licencia |
|---|---|---|---|
| `skills/frontend-design` | Dirección estética al construir interfaces; evita los defaults genéricos | `anthropics/claude-plugins-official`, `plugins/frontend-design` (`e37d307`, 2026-11-11) | Apache 2.0 |
| `skills/impeccable` | 24 comandos de diseño: `/impeccable audit`, `critique`, `polish`, `typeset`, `animate`, `quieter`, etc. | `pbakaus/impeccable` v4.8.2, `plugin/skills/impeccable` (`b4bff16`, 2026-11-11) | Apache 2.0 |
| `agents/impeccable-*.md` | Subagentes de apoyo de Impeccable (revisión final, documentación, edición manual, recursos) | `pbakaus/impeccable`, `plugin/agents` (`b4bff16`) | Apache 2.0 |
| `skills/web-design-guidelines` | Revisión contra las Web Interface Guidelines de Vercel, con salida `archivo:línea` | `vercel-labs/agent-skills` (`1a2c79d`) + `vercel-labs/web-interface-guidelines/command.md` (copia del 2026-11-12) | MIT |
| `skills/web-quality-audit`, `accessibility`, `performance`, `core-web-vitals`, `best-practices`, `seo` | Auditorías medidas: Lighthouse, Core Web Vitals, WCAG 2.2, SEO | `addyosmani/web-quality-skills` v2.0 (`afa8da9`, 2026-08-24) | MIT |

## Cambios locales respecto al original

- **Impeccable sin hooks.** No se copió `plugin/hooks/hooks.json`; el plugin
  original ejecuta su motor al iniciar la sesión, tras cada edición y al
  terminar, aunque se rechacen los comandos del modelo.
- **Impeccable sin modo live.** Se quitaron `scripts/live-browser*.js` y
  `scripts/modern-screenshot.umd.js`. El modo live puede lanzar Claude con los
  permisos desactivados; no se usa en este proyecto.
- **Motor de Impeccable.** El lanzador `scripts/impeccable` descarga un binario
  (verificado con `engine-checksums.txt`) desde las releases de GitHub la
  primera vez. Si la descarga o la ejecución no están permitidas, el skill
  funciona en modo degradado: lee el contexto del proyecto directamente.
  Telemetría desactivada con `DO_NOT_TRACK=1` en `settings.json`.
- **web-design-guidelines lee una copia local** (`guidelines.md`) en vez de
  descargar las reglas en cada revisión.

## Actualizar

Clonar el repositorio de origen, comparar la carpeta con la de aquí, revisar el
diff y subirlo en un commit propio que diga la versión nueva. No mezclar
actualizaciones de herramientas con cambios de código del sitio.

## Fuera del repositorio

Los plugins **Design** y **frontend-design** del directorio de Anthropic se
pueden activar también desde la cuenta de claude.ai; no hace falta para que
este repositorio funcione.

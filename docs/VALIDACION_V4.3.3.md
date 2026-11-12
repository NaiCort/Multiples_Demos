# Validación de V4.3.3

Entorno: Node 22, Chromium de Playwright, servidor de desarrollo de Vite. Revisión del 12 de noviembre de 2026. El visto bueno de Ian en sus dispositivos sigue pendiente.

## Comprobaciones

- ESLint, Prettier y compilación de producción sin errores.
- **102 pruebas en catorce archivos.** Se añaden cuatro en `tests/cafe-prepara.test.jsx`: escalado de café, agua y textos por tazas, proporción, paso según el tiempo y formato del reloj, temporizador completo con pausa y repetición (con reloj simulado), y cambio de método con compra del café molido para ese método.
- Recorrido en Chromium a 1440 y 390 px con reloj controlado por Playwright: Chemex a tres tazas (45 g de café), paso actual a los 50 s, pausa que detiene el conteo, final con mensaje de ajuste. Sin errores de consola.
- Durante la revisión se encontró desbordamiento horizontal a 390 px: el encabezado ya no cabía con cuatro enlaces y el pedido. Se reorganizó (enlaces en una segunda fila en el teléfono) y se comprobó que ningún elemento sale de la pantalla.
- axe-core (WCAG 2 A/AA, 2.1 AA, 2.2 AA) en Prepara en casa con la preparación terminada, a 1440 y 390 px: sin infracciones.
- Conteo de patrones vigilados: la numeración por tiempo de los pasos es información de la receta, no decoración. Ningún patrón nuevo.

## No comprobado todavía

Teléfono físico, Safari, lector de pantalla y Core Web Vitals medidos; se harán en la pasada final de V4.3.4.

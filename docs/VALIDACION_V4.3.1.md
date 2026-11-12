# Validación de V4.3.1

Entorno: Node 22, Chromium de Playwright, servidor de desarrollo de Vite. Revisión del 12 de noviembre de 2026. El visto bueno de Ian en sus dispositivos sigue pendiente.

## Comprobaciones

- ESLint, Prettier y compilación de producción sin errores.
- **93 pruebas en doce archivos.** Se añaden seis en `tests/cafe-pedido.test.jsx`: precios con extras y agrupación de líneas, confirmación sin nombre rechazada, bloqueo de un segundo pedido, etapas por tiempo, horarios de recogida (incluido el salto al día siguiente tras el cierre del domingo), datos guardados dañados, personalización desde la carta con aviso y conteo, y confirmación con validación, foco al campo incorrecto, procesamiento y seguimiento sin llamadas de red.
- Recorrido completo en Chromium a 1440 y 390 px: agregar con personalización, filtrado con otro lote, error de nombre, confirmación, seguimiento, recarga con el pedido conservado, estado "listo" con vapor, "Ya lo recogí" y nuevo pedido con el contador en cero. Sin desbordamiento horizontal ni errores de consola.
- axe-core (WCAG 2 A/AA, 2.1 AA, 2.2 AA) en carta, ventana de personalización, aviso, pedido con error y seguimiento: sin infracciones. En el pedido con error, axe midió la llamada comercial compartida mientras aparecía con fundido (contraste 1.01 en plena transición); en reposo no hay infracción.
- Conteo de patrones vigilados en Carta y Pedido: ninguno de la lista. La numeración de las etapas del seguimiento se conserva porque el orden es información.

## No comprobado todavía

Teléfono físico, Safari, lector de pantalla y Core Web Vitals medidos; se harán en la pasada final de V4.3.4.

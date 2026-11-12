# Validación de V4.3.2

Entorno: Node 22, Chromium de Playwright, servidor de desarrollo de Vite. Revisión del 12 de noviembre de 2026. El visto bueno de Ian en sus dispositivos sigue pendiente.

## Comprobaciones

- ESLint, Prettier y compilación de producción sin errores.
- **98 pruebas en trece archivos.** Se añaden cinco en `tests/cafe-origen.test.jsx`: precio y descripción de la bolsa por peso y molienda, sección de grano en la carta, página de Origen con perfil y cuatro fichas, compra de una bolsa de 1 kg guardada en el pedido, y V60 abierto con el lote de la ficha.
- Recorrido en Chromium a 1440 y 390 px: compra de bolsa, V60 con lote preseleccionado, ancla `#tres-pasos` con foco en el título del lote, línea de la bolsa en Pedido; sin desbordamiento horizontal ni errores de consola. Durante la revisión se corrigió un trazado SVG inválido de la pendiente y se separaron las etiquetas de la línea.
- axe-core (WCAG 2 A/AA, 2.1 AA, 2.2 AA) en Origen, ventana de la bolsa e Inicio, a 1440 y 390 px: sin infracciones. El marco desplazable de la gráfica es enfocable con teclado.
- Conteo de patrones vigilados: ninguno nuevo. La gráfica es información (altitud por lote), no una fila de cifras decorativa.

## No comprobado todavía

Teléfono físico, Safari, lector de pantalla y Core Web Vitals medidos; se harán en la pasada final de V4.3.4.

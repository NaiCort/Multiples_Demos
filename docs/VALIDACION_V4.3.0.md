# Validación de V4.3.0

Entorno: Node 22, Chromium de Playwright, servidor de desarrollo de Vite. Revisión del 12 de noviembre de 2026. El visto bueno de Ian en sus dispositivos sigue pendiente.

## Comprobaciones

- ESLint, Prettier (`format:check`) y compilación de producción sin errores.
- **87 pruebas en once archivos.** Se conservan las 81 anteriores y se añaden seis en `tests/cafe.test.jsx`: niveles de las curvas, dibujo determinista por semilla, integridad de los lotes, página con un solo `main` y un solo `h1` sin `href="#"`, WhatsApp simulado que abre y cierra, y redirección de rutas desconocidas a Inicio.
- Capturas en Chromium a 1440 y 390 px: sin desbordamiento horizontal, sin errores de consola, fuentes propias cargadas, metadatos propios de la ruta.
- axe-core (WCAG 2 A/AA, 2.1 AA, 2.2 AA y buenas prácticas) a 1440 y 390 px: sin infracciones WCAG. Queda una alerta de buenas prácticas (`region`) en el banner compartido de demo, que también aparece en Patio 12; se anota para V4.8.
- Conteo de patrones vigilados en Inicio: ninguno de la lista de la Guía v1.1 en el código de Ladera. Durante la revisión se retiró la franja de color en el borde superior de la ficha, que habría sido el patrón de borde de color en un lado. La llamada comercial compartida conserva su etiqueta superior; se revisará en V4.8.
- `npm audit`: los avisos moderados de dependencias de desarrollo ya registrados (vitest, minimatch vía ESLint); ninguno nuevo.

## No comprobado todavía

Teléfono físico, Safari, lector de pantalla y Core Web Vitals medidos; se harán en la pasada final de V4.3.4.

## Reproducción

```bash
npm ci
npm run lint
npm run format:check
npm test
npm run build
```

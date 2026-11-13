# Validación de V4.3.5

Entorno: Node 22, Chromium de Playwright; servidor de desarrollo y vista previa de producción. 13 de noviembre de 2026. El visto bueno de Ian en sus dispositivos sigue pendiente.

## Comprobaciones

- ESLint, Prettier y compilación sin errores. Ladera pesa 61 kB de JavaScript (19 kB comprimido) y 1.7 MB de fotos en dos tamaños.
- **111 pruebas en dieciséis archivos.** Se añaden cuatro en `tests/cafe-tueste.test.jsx`: estado del local según el horario, fotos existentes con texto alternativo, autor, licencia libre y huella, página de créditos con enlace por foto, y portada con foto prioritaria, cinta con pausa y relieve.
- **Navegador (`npm run test:browser:cafe`):** cinco escenarios de 320 a 1440 px sobre producción, ahora con Créditos, decodificación de cada foto local y la cinta (se detiene con movimiento normal; queda quieta y sin botón con movimiento reducido). Axe en las siete páginas sin infracciones WCAG. **5 de 5 aprobados.**
- **Conteo de patrones** en las siete páginas: sin degradados decorativos, vidrio, brillos ni bordes de color; un solo `h1`. La única etiqueta en mayúsculas sigue siendo la de la llamada comercial compartida (pendiente V4.8). Fondo cálido, serif expresiva, cinta y relieve a color están justificados en la ficha.
- **Core Web Vitals de laboratorio** (390 px, CPU 4× más lenta, 4G lenta):

| Página | LCP | CLS |
|---|---|---|
| Inicio | 2.06 s | 0.002 |
| La carta | 1.88 s | 0.024 |
| Origen | 1.90 s | 0.001 |
| Prepara en casa | 1.97 s | 0.023 |
| Visítanos | 1.94 s | 0.004 |
| Pedido | 1.85 s | 0.017 |
| Créditos | 1.75 s | 0.146 |

Durante la revisión, Visítanos tenía LCP de 3.4 s porque la foto de encabezado cargaba de forma diferida; se marcó como prioritaria y se añadieron versiones de 640 px. El CLS de Créditos (0.146, por encima de 0.1) se debe al cambio de tipografía cuando las fuentes llegan tarde en red lenta (medido: la lista crece 54 px al cargar Source Serif 4 a los 4.8 s); no a las fotos. Se corrige precargando las fuentes en `index.html`, archivo compartido anotado para V4.8.

## No comprobado

Teléfono físico, Safari y lector de pantalla real: revisión de Ian en la vista previa.

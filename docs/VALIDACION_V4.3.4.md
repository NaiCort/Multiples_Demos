# Validación de V4.3.4 · cierre de Café

Entorno: Node 22, Chromium de Playwright; servidor de desarrollo de Vite y vista previa de producción. Revisión del 12 de noviembre de 2026. El visto bueno de Ian en sus dispositivos sigue pendiente.

## Comprobaciones automáticas

- ESLint, Prettier y compilación de producción sin errores.
- **107 pruebas en quince archivos.** Se añaden cinco en `tests/cafe-visitanos.test.jsx`: sello al recoger (una sola vez y conservado al reiniciar), canje solo con tarjeta llena, deshacer que devuelve la línea a su lugar, sábados y lugares de la cata, y reserva con nombre obligatorio, guardado y cancelación con confirmación.
- **Pruebas de navegador nuevas:** `npm run test:browser:cafe` (con `DEMO_START_PREVIEW=1` tras el build). Cinco escenarios a 320, 390, 768, 1024 y 1440 px, con reloj controlado: las cinco páginas con un solo `h1`, sin desbordamiento y con axe; personalización con precio; compra de bolsa; quitar y deshacer; error de nombre; confirmación, seguimiento hasta "listo", recarga y sello; temporizador completo de Chemex; reserva y cancelación de la cata; enlace de la Bienvenida. Sin errores JavaScript, sin peticiones POST/PUT/PATCH/DELETE y sin recursos locales rotos. **5 de 5 aprobados.**

## Pasada final de la Guía v1.1

- **Conteo de patrones** en las seis páginas de Ladera (estilos calculados en navegador): sin texto con degradado, sin degradados, sin vidrio, sin brillos, sin bordes de color en un lado, un solo `h1` por página. La única etiqueta en mayúsculas es la de la llamada comercial compartida, ya anotada para V4.8. Fuentes: Ladera Sans, Ladera Serif y la del banner compartido.
- **Web Interface Guidelines (Vercel):** se revisaron las reglas de accesibilidad, foco, formularios, animación, tipografía, contenido, imágenes y toque. Se corrigió: campos sin `name`, acciones destructivas sin deshacer o confirmación (quitar línea, cancelar cata) y `touch-action`. Quedan anotadas como no aplicables o diferidas: precarga de fuentes en `index.html` (archivo compartido, V4.8) y sincronizar con la URL la sección de la carta (se usan anclas).
- **Impeccable:** su detector automático no se ejecutó porque el modo automático del entorno bloquea descargar su binario. Se aplicó su lista de comprobación (`craft-floor`) a mano: contraste, profundidad con desplazamiento, un momento de movimiento por página, estados completos y partes del navegador tematizadas (selección, foco, barras de desplazamiento, subrayado, cifras tabulares).
- **Core Web Vitals de laboratorio** en vista previa de producción, teléfono de 390 px con CPU 4× más lenta y red 4G lenta (150 ms, 1.6 Mbps):

| Página | LCP | CLS |
|---|---|---|
| Inicio | 2.31 s | 0.002 |
| La carta | 1.95 s | 0.021 |
| Origen | 2.14 s | 0.002 |
| Prepara en casa | 1.96 s | 0.058 |
| Visítanos | 1.87 s | 0.004 |
| Pedido | 1.93 s | 0.065 |

Todas dentro de "bueno" (LCP ≤ 2.5 s, CLS ≤ 0.1). Son mediciones de laboratorio, no datos de usuarios reales.

## No comprobado

Teléfono físico, Safari y lector de pantalla real: quedan para la revisión de Ian en la vista previa.

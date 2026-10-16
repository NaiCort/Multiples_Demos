# Validación de V4.2.4

Base publicada: V4.2.3, `672a7739f0c11a947a96b0b11a93c6f9eb077e2c`. Entorno: Node 24.19.0, Chromium Headless Shell 153 y vistas de producción de Vite. Revisión del 15 de octubre de 2026. Pendiente del visto bueno de Ian en sus dispositivos.

## Comprobaciones

- ESLint, compilación de producción, `git diff --check` y auditoría npm sin vulnerabilidades detectadas. No se actualizan dependencias respecto de la base; solo cambia la versión del proyecto y se añade el comando de comprobación V4.2.4.
- **72 pruebas en nueve archivos.** Se mantienen las 66 anteriores y se añaden seis sobre galerías, foco, recuperación de búsqueda vacía, avisos repetidos, persistencia entre páginas y configuraciones de ensalada anteriores con el mismo precio y local.
- **33 escenarios de navegador:** siete nuevos, doce de recorridos completos y catorce de locales/mapas/QR. Todos aprobados en la versión final.
- Los siete nuevos comprueban carta, galerías, foco y carrito a 320, 390, 768 y 1440 px con animaciones, y a 390 px con movimiento reducido. Incluyen activación de movimiento reducido durante una visita, tacto, fotografías locales, decodificación de todas las vistas y verificación de sus huellas.
- Los doce recorridos conservados cubren espera, asignación de mesa, salto, exploración, personalización, edición, carrito, retorno desde el portafolio y cierre a 320, 390, 768, 1024 y 1440 px. Incluyen móvil con animaciones, filtros e historial, combos/bebidas, entrega/beneficio/recibo/perfil, minuto automático, arrastre/límites, reserva y foco, almacenamiento bloqueado y ventana flotante denegada.
- Los catorce escenarios de locales recorren ocho fichas a cuatro tamaños; QR de mesas 1/25; rutas inválidas y enlace antiguo; cambio de local conservando platos; pedido confirmado fijo y reserva independiente; agrupación/filtros del mapa en móvil/escritorio; entrega/recarga; ubicación y proveedor denegados. El último exige cartografía pública con `DEMO_REQUIRE_LIVE_MAP=1`: OpenFreeMap cargó correctamente.
- MapLibre y worker reales se prueban con un estilo mínimo para aislar agrupación y filtros; el proveedor público se comprueba aparte. No se presenta un estilo simulado como cartografía real.
- axe-core en páginas y estados críticos, sin infracciones detectadas en las reglas WCAG seleccionadas. Se verifican límites de pantalla, foco de diálogos, teclado, Escape y recursos locales. Los recorridos no envían pedidos mediante POST/PUT/PATCH/DELETE.
- Revisión visual de capturas de carta, producto y pedido en móvil/escritorio. Las fotos mantienen marcos y proporción. Ensalada y hamburguesa tienen tomas coherentes; queso y café corresponden al tipo de preparación anunciado. Procedencia y licencias documentadas en [Recursos](RECURSOS_RESTAURANTE.md).
- Psicólogo, portada, rutas globales y componentes compartidos no se modifican. La suite unitaria completa conserva sus comprobaciones previas. No se atribuye a V4.2.4 una nueva revisión física ni una nueva matriz completa de navegador de Psicólogo.
- Actualizador verificado sobre copias de la base: aplicación íntegra e historial conservado; repetición rechazada; cambios propios y rama existente preservados; base distinta y parche alterado rechazados; checkout CRLF con índice igual a la fuente entregada. La instalación y las comprobaciones npm se repiten sobre la copia actualizada.

## Ajustes surgidos de la revisión

El primer fundido de páginas reducía el contraste mientras aparecía el contenido. Se sustituyó por un desplazamiento de 6 px que mantiene plenamente opaco el texto; filtros y avisos también conservan el contraste. Las fotografías mantienen un fundido breve propio.

Las comprobaciones de navegación esperan la ruta activa. El arrastre espera la posición visible y las fuentes antes de tomar coordenadas; no se confunde una posición anterior con un fallo del contador. Se conservan las comprobaciones de estado y del destino del arrastre.

Se retira la segunda foto de pasta porque mostraba otra receta. No se rellena una galería con una imagen incoherente. Se usan únicamente fotografías con ficha pública y publicación aprobada; los archivos nuevos tienen huellas SHA-256 registradas.

## Reproducción

```bash
npm ci
npm run lint
npm test
npm run build
npm audit
```

Después del build, con Edge instalado en Windows, por separado:

```bash
DEMO_START_PREVIEW=1 DEMO_BROWSER_CHANNEL=msedge npm run test:browser:restaurante:v424
DEMO_START_PREVIEW=1 DEMO_BROWSER_CHANNEL=msedge npm run test:browser:restaurante
DEMO_START_PREVIEW=1 DEMO_BROWSER_CHANNEL=msedge npm run test:browser:restaurante:v423
```

Cada script inicia y cierra una vista previa en el puerto 4173. También admite `DEMO_BROWSER_CHANNEL=chrome` o un Chromium instalado con Playwright. Se conservan `DEMO_BASE_URL`, `DEMO_BROWSER_EXECUTABLE`, `DEMO_TEST_OUTPUT`, `DEMO_SCENARIO` y las copias exactas opcionales de recursos externos mediante `DEMO_TEST_FIXTURES`. Las capturas y resultados quedan en `test-results/`, fuera de Git y del ZIP. No se necesitaron copias externas para esta matriz del restaurante.

## Límites

La emulación de tamaños y tacto no sustituye una revisión en teléfono físico, Safari/iOS/Android ni lectores de pantalla. Pasar axe no demuestra conformidad integral. La revisión final de Ian debe incluir computadora y un teléfono real.

El mapa depende de un proveedor externo; la lista manual y los pedidos siguen disponibles ante fallos. Vite conserva el aviso del módulo de mapa mayor de 500 kB, aproximadamente 285 kB gzip más worker. Se carga bajo demanda al abrir un mapa.

Las fotos son ilustrativas; ingredientes, porciones, nutrientes, disponibilidad, precios, perfiles, reservas, pedidos, reparto, pagos y recibos son ficticios. No se realizan cobros ni se envían correos. Esta candidata no se publica automáticamente ni declara finalizadas las otras identidades de Restaurante.

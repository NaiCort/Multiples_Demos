# Validación de V4.2.5

Base: V4.2.4 publicada, `0f84a9d6fb0d999255488129152f3bdf52ca5d43`. Entorno: Node 24.19.0, Chromium Headless Shell 153, vista de producción de Vite. Revisión del 16 de octubre de 2026. El visto bueno en dispositivos de Ian sigue pendiente.

## Comprobaciones

- ESLint, compilación de producción y comprobación de espacios del parche. Auditoría npm: cero vulnerabilidades detectadas en esta revisión. No se añaden ni actualizan dependencias; cambian la versión del proyecto y el comando de comprobación V4.2.5.
- **81 pruebas en diez archivos.** Las 72 anteriores se conservan, ajustando los conteos a la carta y locales ampliados. Se añaden nueve que cubren catálogo regional, compatibilidad de filtros, conservación y bloqueo del carrito, recibos, directorio internacional, parámetros inválidos, cambio de país/estado/ciudad e historial.
- **42 escenarios de navegador:** nueve de V4.2.5, doce de recorridos generales, catorce de locales/mapas/QR y siete de galerías, foco, movimiento y fotografías.
- Los nuevos escenarios prueban Carta y Locales a 320, 390, 768, 1024 y 1440 px. Comprueban barra lateral en escritorio y selectores en móvil, categorías, búsquedas/preferencias combinadas, recuperación de búsqueda vacía, países y estados, ciudad compatible, recarga e independencia del local activo.
- Se prueban especialidades de CDMX, Austin y San Francisco, cambios de local antes y durante la confirmación, avisos, retirada del plato incompatible, confirmación y recuperación del mismo recibo. El estado rechaza añadir, editar o confirmar un producto regional en otro local.
- Se recorren las ocho fichas nuevas, una reserva independiente en Estados Unidos y un QR de mesa en Golden Gate Park. Se mantienen los recorridos anteriores de las ocho fichas originales, espera, mesa, recogida, entrega, combos, beneficios, perfil, recibos y recuperación entre páginas.
- MapLibre y su worker se prueban con estilo mínimo para aislar filtros y agrupación: 16 marcadores generales, cuatro estadounidenses y dos por estado. Se comprueba selección sin alterar el pedido y ausencia de reconstrucción por el reloj. La cartografía pública de OpenFreeMap se prueba aparte, con `DEMO_REQUIRE_LIVE_MAP=1`; cargó correctamente.
- Se mantienen los casos de geolocalización y proveedor denegados, almacenamiento bloqueado y ventana flotante no disponible. Las acciones siguen siendo simuladas y no envían pedidos mediante POST/PUT/PATCH/DELETE.
- Las 31 fotografías adicionales se verifican con SHA-256 y decodificación en navegador. Se inspeccionan visualmente; se usan fotos de platos o bebidas, no imágenes de ingredientes o preparación para sustituir un plato. Las galerías anteriores mantienen sus fotos y marcos. Los créditos públicos identifican fuente, autor y licencia individual.
- axe-core no detecta infracciones de las reglas WCAG seleccionadas en las páginas y estados auditados. Se comprueban foco, límites de pantalla y diálogos. La emulación incluye tacto y movimiento reducido, también activado durante la misma visita.
- El actualizador se verifica sobre copias de la base: aplicación íntegra sin alterar el historial, rechazo de repetición, cambios propios preservados, rama duplicada y base distinta rechazadas, índice correcto con CRLF y parche alterado rechazado. La instalación y las comprobaciones npm se repiten sobre la copia actualizada.

## Ajustes de las comprobaciones

Con la carta ampliada, una foto dejó de ser el primer contenido de la página. La prueba táctil ahora centra la foto y verifica que el punto inicial del gesto esté sobre ella, fuera de la barra fija y de sus botones, antes de enviar el gesto. Se conserva la comprobación de que cambia a la segunda fotografía. No se interpreta un toque enviado sobre la barra de navegación como un fallo de la galería.

Las comprobaciones de filtros esperan los resultados de la navegación de React Router antes de contar los productos o marcadores. Se mantiene la verificación del conteo y de los identificadores correctos, con foco y URL.

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
DEMO_START_PREVIEW=1 DEMO_BROWSER_CHANNEL=msedge npm run test:browser:restaurante:v425
DEMO_START_PREVIEW=1 DEMO_BROWSER_CHANNEL=msedge npm run test:browser:restaurante
DEMO_START_PREVIEW=1 DEMO_BROWSER_CHANNEL=msedge npm run test:browser:restaurante:v423
DEMO_START_PREVIEW=1 DEMO_BROWSER_CHANNEL=msedge npm run test:browser:restaurante:v424
```

Cada script inicia y cierra una vista previa en el puerto 4173. También se admite Chrome o un Chromium de Playwright. Se conservan `DEMO_BASE_URL`, `DEMO_BROWSER_EXECUTABLE`, `DEMO_TEST_OUTPUT`, `DEMO_SCENARIO` y `DEMO_TEST_FIXTURES`. Resultados y capturas quedan en `test-results/`, excluido de Git y del ZIP. No se necesitaron copias externas para la matriz del restaurante.

## Límites

Las pruebas emulan tamaños, tacto y preferencias; no sustituyen un teléfono físico, Safari/iOS/Android ni un lector de pantalla. Pasar axe no demuestra conformidad completa. Ian debe revisar en computadora y teléfono real antes de publicar.

Vite conserva el aviso por el módulo del mapa mayor de 500 kB, aproximadamente 285 kB gzip más worker. Se carga bajo demanda, igual que en la base. La cartografía depende de un proveedor externo; la lista manual y el resto de la demo siguen disponibles ante fallos.

Las fotos son ilustrativas y tienen diferentes resoluciones de origen. Las recetas, porciones, nutrientes, alérgenos, disponibilidad, precios, sucursales, pagos y pedidos son ficticios. Los precios siguen en MXN en ambos países, sin conversión de moneda. No se certifica autenticidad culinaria ni información dietética.

Psicólogo, portada, rutas globales y componentes compartidos no se editan. La suite completa conserva sus pruebas; no se atribuye a esta entrega una nueva matriz física o completa de navegador de Psicólogo. La candidata no se publica automáticamente ni incorpora administración u otras identidades del restaurante.

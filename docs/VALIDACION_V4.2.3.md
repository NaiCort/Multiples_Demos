# Validación de V4.2.3

Base: V4.2.2 publicada, `72a4c56da2a240fd572a2fc0a84bbb51645a8560`. Entorno de comprobación: Node 24.19.0, Chromium Headless Shell 153 y vistas de producción de Vite. Fecha: 15 de octubre de 2026.

## Comprobaciones

- ESLint, compilación de producción y `git diff --check`.
- 66 pruebas de estado e integración en ocho archivos. Incluyen migración de sesiones, precios/configuración, espera, perfiles, local inicial, conservación de local, cambio de mesa, filtros en URL, rutas y reservas independientes.
- Suite de Restaurante: doce escenarios de navegador. Se comprueba el recorrido completo a 320, 390, 768, 1024 y 1440 px, más móvil con animaciones activadas. Incluye menú móvil, carta/configuración, espera y salto, mesa estable, edición, carrito, retorno desde el portafolio, pedido y cierre. Casos adicionales verifican filtros e historial, combos/bebidas, entrega/beneficios/recibo, minuto automático, arrastre/límites, reserva/foco y uso táctil con almacenamiento/ventana flotante denegados.
- Suite de locales: catorce escenarios. Recorre ocho fichas a cuatro anchos, dos referencias de CDMX, QR de mesas 1 y 25, rutas/enlaces inválidos, enlace antiguo de seguimiento, cambio de local en mesa, pedido confirmado fijo, reserva independiente, agrupación y filtros del mapa en escritorio/móvil, ruta/recarga, permisos/proveedor denegados y proveedor público.
- Motor MapLibre y worker reales con estilo mínimo determinista para comprobar marcadores, agrupación, filtros y avance sin depender de cartografía externa. Una prueba separada carga OpenFreeMap público; `DEMO_REQUIRE_LIVE_MAP=1` exige su carga.
- PNG de QR de mesas 1 y 25 decodificados independientemente con ZXing; ambos coinciden con punto y mesa y no contienen datos del pedido.
- axe-core en páginas y estados críticos, sin infracciones en las reglas WCAG seleccionadas. Se comprueban también foco circular en diálogos, Escape, filtros, límites de pantalla y recursos locales. No se envían solicitudes POST/PUT/PATCH/DELETE desde los recorridos.
- Regresión de Psicólogo: cuatro temas a 320, 390, 768 y 1440 px, recorridos de reserva/contacto/privacidad/menú y dos escenarios adicionales del selector.
- Actualizador probado sobre copia de la base: aplicación íntegra, historial conservado, rechazo de repetición, cambios propios, rama duplicada y otra base; checkout con CRLF equivalente a Git Bash. El código preparado coincide con la fuente entregada.

## Reproducción

```bash
npm ci
npm run lint
npm test
npm run build
npm audit
```

Con Edge instalado, después del build:

```bash
DEMO_START_PREVIEW=1 DEMO_BROWSER_CHANNEL=msedge npm run test:browser:restaurante
DEMO_START_PREVIEW=1 DEMO_BROWSER_CHANNEL=msedge npm run test:browser:restaurante:v423
```

Los scripts inician y cierran una vista previa en el puerto 4173. Alternativamente, `DEMO_BROWSER_CHANNEL=chrome`, un ejecutable mediante `DEMO_BROWSER_EXECUTABLE` o Chromium instalado con Playwright. Admiten `DEMO_BASE_URL` y `DEMO_TEST_OUTPUT`. `DEMO_SCENARIO` filtra por expresión regular para diagnosticar un caso. El comando `test:browser:restaurante:v422` se conserva como alias de la suite actual de locales/regresiones.

Psicólogo conserva su script original: deja `npm run dev` abierto en otra terminal y ejecuta `DEMO_BROWSER_CHANNEL=msedge npm run test:browser`.

Las pruebas admiten `DEMO_TEST_FIXTURES`: copias exactas de recursos externos de la portada/Psicólogo para un entorno de pruebas con conectividad limitada. No se sustituyen URLs de producción ni se distribuyen esas copias dentro del ZIP. Los mapas con estilo mínimo se identifican como prueba del motor; no se presentan como cartografía pública. Capturas y resultados se guardan en `test-results/`, fuera de Git y del ZIP.

## Límites

Las pruebas automatizadas y la emulación de tamaños/tacto no equivalen a una revisión completa con lectores de pantalla ni a dispositivos físicos Safari/iOS/Android. La ventana externa depende del navegador; se comprueba su recuperación ante rechazo. No se afirma compatibilidad universal ni conformidad integral por pasar axe.

La cartografía depende de un proveedor externo. La lista manual y el pedido siguen disponibles ante fallo de red, WebGL o tiempo agotado. El módulo MapLibre supera 500 kB (aproximadamente 285 kB gzip más worker); se carga únicamente al abrir un mapa y se conserva el aviso de Vite.

Los recibos, perfiles, pagos, reservas, horarios, existencias, mesas, nutrientes y beneficios son ficticios. No se prueban cobros, correos, cocina, reparto ni servidor reales. No se publica esta candidata automáticamente; Ian debe revisar y aprobar su apariencia y recorrido.

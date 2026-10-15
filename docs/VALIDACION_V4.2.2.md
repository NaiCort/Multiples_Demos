# Validación de V4.2.2

Fecha: 15 de octubre de 2026. Node 24.19.0. Base publicada V4.2.1, commit `53118a2d698327c30d8e5b6e4ed398e5358668ec`.

## Comprobaciones

- ESLint sin errores ni avisos.
- 56 pruebas en siete archivos: las 40 anteriores más 16 de V4.2.2. Cubren configuración, importes, nutrientes ficticios, combinaciones, cobertura, QR, husos, bloqueo del punto y migración de sesiones.
- Build de Vite correcto. Conserva carga diferida por giro y añade módulos diferidos de mapa/worker y QR.
- `npm audit`: cero vulnerabilidades reportadas en esta comprobación.
- Restaurante: 13 escenarios previos de navegador, con pruebas en 320, 390, 768, 1024 y 1440 px; espera automática, tacto/ratón, posición, cambio de ruta, pedido, perfil, reserva y recuperación.
- V4.2.2: 11 escenarios nuevos; identidad, ocho puntos y QR en 320/390/768/1440 px; mesas QR 1 y 25, recuperación de enlace inválido; bebida, combo y recibo; cobertura y ubicación fija; fallo cartográfico, permiso denegado y proveedor cartográfico público.
- Motor MapLibre y worker comprobados con un estilo mínimo de prueba, para separar lógica de la disponibilidad de la red. Cartografía pública de OpenFreeMap comprobada además con su estilo real, marcador visible, lienzo de al menos 250 px y atribución.
- El PNG de QR generado se decodificó con un lector independiente (ZXing) y coincidió con el enlace del punto Tijuana y mesa 25. No se añade ese lector al proyecto.
- Psicólogo: 16 combinaciones (cuatro temas por cuatro anchos) y dos recorridos de selector. Pruebas de sala 4:3, reserva, formulario, WhatsApp, privacidad, foco, teclado, persistencia y retorno. No se modifican los archivos de su aplicación.
- Comprobaciones automáticas de accesibilidad con axe-core, navegación por teclado, ausencia de desborde y capturas revisadas. Ningún flujo de demostración intentó POST/PUT/PATCH/DELETE.

## Reproducir

```bash
npm ci
npm run lint
npm test
npm run build
npm audit
DEMO_START_PREVIEW=1 DEMO_BROWSER_CHANNEL=msedge npm run test:browser:restaurante
DEMO_START_PREVIEW=1 DEMO_BROWSER_CHANNEL=msedge npm run test:browser:restaurante:v422
```

Los dos scripts de Restaurante inician/cierra su propia vista previa. Con Chrome se puede usar `DEMO_BROWSER_CHANNEL=chrome`; también puede instalarse Chromium con `npx playwright install chromium` y omitir la variable del canal. `DEMO_REQUIRE_LIVE_MAP=1` hace obligatoria la carga del proveedor público en el script nuevo; sin ella se verifica la recuperación manual si el proveedor está inaccesible. El resto de escenarios del motor sigue siendo determinista.

Para Psicólogo, dejar `npm run dev` en otra terminal y ejecutar `DEMO_BROWSER_CHANNEL=msedge npm run test:browser`.

Los resultados/capturas se escriben en `test-results/`, excluido de Git y del ZIP. En este entorno se usó Chrome Headless Shell 153 mediante `DEMO_BROWSER_EXECUTABLE`; el navegador se ejecutó con proxy del entorno. Para evitar inestabilidad de Google Fonts en la regresión previa puede usarse su opción de copias exactas de recursos (`DEMO_TEST_FIXTURES`), sin cambiar las URLs de la aplicación.

## Integridad y actualización

El actualizador se probó en copias independientes: aplicación completa sin cambiar HEAD, rechazo de una repetición con cambios preparados, rechazo de árbol sucio conservando un archivo local, rama duplicada y commit de partida diferente. También se aplicó sobre un checkout con `core.autocrlf=true`, comprobando que el índice coincide exactamente con los archivos de la candidata. El ZIP incluye fuente completa, parche incremental, huellas SHA-256, instrucciones y mensaje de commit; no incluye repositorio `.git`, dependencias instaladas ni resultados privados de pruebas.

## Límites de la validación

No es una certificación de accesibilidad ni sustituye la revisión de Ian. No se probó en un iPhone o Android físico ni en Safari; los tamaños/tacto se simularon en Chromium. No se probaron servicios de cocina, cuentas, pagos o reparto reales porque no existen en la demo. La ventana Picture-in-Picture depende del navegador; mantiene su recuperación cuando es rechazada.

El mapa tiene un módulo mayor de 500 kB minificado (aprox. 285 kB gzip, más worker y cartografía). Vite muestra el aviso; no es una vulnerabilidad ni impide compilar. La prueba comprueba que no se piden teselas antes de abrir un mapa. OpenFreeMap es un servicio externo y su disponibilidad no está garantizada por este proyecto.

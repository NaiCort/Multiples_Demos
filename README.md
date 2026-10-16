# Multiples_Demos · V4.2.5

Portafolio de demos interactivas de **Ian Habid Aldana Martínez**.

- Repositorio: https://github.com/NaiCort/Multiples_Demos
- Despliegue habitual: https://multiples-demos.vercel.app/
- Base: V4.2.4 publicada por Ian, commit `0f84a9d6fb0d999255488129152f3bdf52ca5d43`.
- Fecha de esta candidata: 16 de octubre de 2026. Pendiente de revisión de Ian y publicación.

V4.2.5 amplía **Patio 12** con navegación lateral en Carta y Locales. Incluye 43 productos definidos: 27 comunes y una especialidad diferente por cada uno de los 16 locales, para un total de 28 opciones visibles por local. El directorio reúne México y Estados Unidos, organiza las fichas por país y estado y filtra el mapa con la misma selección. Se conservan fotos completas, galerías, personalizaciones, carrito, temporizadores y recorridos anteriores. La portada sigue como directorio temporal; Psicólogo conserva sus cuatro temas aprobados. Las otras identidades y giros mantienen su planificación previa.

## Desarrollo

Node 22.22.2+ de la rama 22, 24.15.0+ de la rama 24 o 26+. Se comprobó con Node 24.19.0.

```bash
npm ci
npm run dev
```

Abre `/restaurante` o `/psicologo` en la dirección que indique Vite.

```bash
npm run lint
npm test
npm run build
npm audit
```

## Páginas de Patio 12

| Ruta | Función |
|---|---|
| `/restaurante` | Inicio, presentación, tres destacados, modalidades y ejemplos de locales |
| `/restaurante/carta` | 28 opciones por local, categorías laterales, especialidades regionales, búsqueda y personalización |
| `/restaurante/locales` | 16 fichas debajo del mapa bajo demanda; navegación por país, estado y ciudad |
| `/restaurante/locales/:pointId` | Ficha propia, reserva, pedido, mapa y QR de cada local |
| `/restaurante/conocenos` | Concepto, valores y equipo ficticio identificado como ejemplo |
| `/restaurante/pedido` | Carrito, edición y confirmación de pedido |
| `/restaurante/seguimiento` | Espera de mesa, etapas, recibo y cierre de la misma visita |

No se bloquea Inicio con una ventana automática. Se elige modalidad en Inicio o al personalizar el primer producto. Los filtros de Locales usan `pais`, `estado` y `ciudad`; explorar una zona no cambia el local activo. Los filtros de Carta usan parámetros `categoria`, `preferencia` y `buscar`; el regreso desde el carrito conserva la última URL de Carta. Las rutas admiten acceso directo, recarga y navegación atrás/adelante. Una ruta inexistente ofrece recuperación sin borrar la sesión. El antiguo enlace `?seguimiento=...` continúa hacia la página de seguimiento; `punto` y `mesa` siguen validados.

## Recorridos de Patio 12

- **Modalidad:** comer aquí, para llevar o a domicilio desde Inicio o el selector de la barra. Se permite explorar como invitado y cambiar modalidad antes de confirmar un pedido.
- **Comer aquí:** espera de 60 segundos, exploración y configuración durante la espera, botón para saltarla y mesa ficticia del 1 al 25. La mesa se asigna una vez y habilita añadir platos. La reserva futura mantiene su recorrido independiente.
- **Carta:** desayunos, antojos, entradas, platos fuertes, carnes y parrilla, ensaladas, especialidades de la casa, sabores de la región, postres, bebidas y vinos/cervezas/cocteles. Columna de categorías a la izquierda en escritorio y selector compacto en pantallas pequeñas. Búsqueda sin acentos y preferencias de receta base vegetariana, vegana o con carne. Los resultados se agrupan por categoría. Los doce productos anteriores conservan sus precios, identificadores y personalizaciones; ensalada y hamburguesa mantienen sus dos tomas coherentes. Hay 31 fotografías nuevas con atribución y licencia individual.
- **Configuración:** cantidades normales, reducidas, aparte o sin el ingrediente; sustituciones, extras ilustrados y cantidad. Se añaden porciones en sopa, pasta y tacos; proteína/guarnición donde la receta lo admite; tamaños de bebidas y temperatura de café. Los cuatro platos principales admiten combos de entrada pequeña y bebida, con suplementos visibles. La receta base conserva los ingredientes que definen el plato. Precio, nutrientes y alérgenos incluyen también los cambios de porción y los componentes del combo; las cifras se señalan expresamente como ficticias.
- **Pedido:** carrito editable, máximo nueve unidades de cada combinación y recibo con los cambios exactos. Se identifica la mesa o turno. El envío usa tres zonas ficticias con distancia, tiempo orientativo y tarifa, más un escenario fuera de cobertura que impide confirmar. La dirección escrita no se geocodifica.
- **Seguimiento:** 30 segundos de preparación y 10–30 segundos de ruta acelerados, avance automático, saltos de prueba, recogida/entrega y cierre. En producción estos estados dependerían de la cocina y del reparto.
- **Perfil opcional:** Alex Demo, visitas ficticias iniciales, categorías de beneficio, descuentos sobre los platos y hasta diez recibos locales. Solo un pedido finalizado suma una visita. Existe vista previa del correo y explicación de factura; no se envían mensajes ni se emite CFDI.
- **Pago:** efectivo o digital simulados, disponibles también para invitados. No se solicita tarjeta ni se realiza un cobro.
- **Contador:** tarjeta rectangular semitransparente, arrastre con ratón o tacto, cuatro esquinas accesibles por botones, minimización y posición adaptable. Aparece compacto al cambiar de giro o ir al portafolio; tocarlo recupera la misma visita.
- **Ventana externa opcional:** Document Picture-in-Picture, cuando el navegador la expone. Puede mostrar el seguimiento fuera de la pestaña y ofrecer el retorno. Al cerrar la pestaña también termina esta ventana. No se promete una superposición externa en iOS/Android.
- **Reserva futura, WhatsApp, ubicación, privacidad, guía y contacto comercial:** conservan sus recorridos propios. Las acciones del restaurante son ficticias; los canales de contacto con Ian son reales.

## Mapa y accesos de demostración

Dieciséis referencias geográficas: las ocho previas en Xalapa, CDMX (dos), Puebla, Mérida, Guadalajara, Monterrey y Tijuana; cuatro nuevas en Oaxaca de Juárez, San Cristóbal de las Casas, Santiago de Querétaro y Guanajuato; y cuatro en Estados Unidos, Austin y San Antonio (Texas), Los Angeles y San Francisco (California). No son sucursales. Véanse [referencias nuevas](docs/LOCALES_V4.2.5.md).

El mapa usa MapLibre GL JS y cartografía pública de OpenFreeMap, con atribución a OpenMapTiles/OpenStreetMap. Se carga al pulsar **Mostrar mapa interactivo**. La selección manual sigue funcionando ante fallos del proveedor o de WebGL. En Locales el mapa precede a la lista, agrupada por país y estado; la columna lateral permite filtrar y lleva a la lista debajo del mapa. País, estado y ciudad filtran los mismos marcadores y fichas. Los puntos cercanos se agrupan al alejar; pulsar el grupo acerca la vista. Cada ficha mantiene su página, mapa y generador QR.

Los destinos, trazos y cobertura de 5 km son ilustrativos y preparados. No hay tráfico, geocodificación de domicilios ni GPS de reparto. La flecha avanza según el estado y las fechas del mismo pedido. Se separan preparación, recorrido y total orientativo; el reloj usa segundos acelerados para la demo. El punto queda fijo al confirmar aunque después se explore otra ciudad.

**Usar mi ubicación** es opcional y solicita permiso solo al pulsarlo. Busca la referencia más cercana en línea recta; no determina cobertura real ni guarda la coordenada. La selección manual funciona si se deniega el permiso o vence el tiempo.

El generador QR permite copiar un enlace o descargar un PNG. Solo incluye `punto` y, opcionalmente, `mesa` entre 1 y 25. El enlace normal conserva la elección de modalidad y espera de 60 segundos. El QR de mesa representa a alguien ya sentado y evita esa espera; no sustituye una visita activa. No comparte pedidos ni perfiles entre dispositivos. Los enlaces usan el origen donde se abre el sitio: un QR de localhost solo funciona allí; para compartirlo hay que generarlo desde el despliegue publicado.

Reservas, horas y recibos usan el huso del punto, incluido `America/Tijuana`. Los puntos son referencias aproximadas de OpenStreetMap, sin afirmar accesos concretos. No se crean fichas de negocios ni datos estructurados que los presenten como establecimientos.

## Estado local y límites

**Selección inicial: CDMX · Chapultepec**, para todas las modalidades. Explorar un local o mover el mapa no cambia el local del pedido. Se elige explícitamente desde la barra, una ficha o la confirmación del pedido. Cambiar de local antes de confirmar conserva los platos; si se estaba comiendo aquí, reinicia la espera y asignación de mesa en el nuevo local. Un pedido confirmado conserva su local hasta terminar. Una reserva futura puede elegir otro local de manera independiente. La carta común conserva precios e ingredientes; «Sabores de la región» ofrece una receta propia por local. Si el carrito conserva una especialidad de otro local, el usuario puede quitarla o regresar al local correspondiente antes de confirmar. No se elimina automáticamente ni se permite confirmar esa combinación. La comprobación también protege el estado. Los precios de ejemplo siguen en MXN en ambos países, sin conversión ni inventario por sucursal.

El punto elegido, visita activa, carrito, pedido, perfil de muestra y posición se guardan en `localStorage` bajo `patio12-demo-v1`. Se migra de esquema 1 a 2 conservando la sesión V4.2.1; los registros del esquema 1 sin punto y los recibos históricos sin punto se asocian a Xalapa. Una sesión válida con local elegido lo conserva; cambiar el valor inicial a CDMX no traslada pedidos existentes. Los contadores usan fechas de finalización, por lo que recargar o regresar actualiza el tiempo transcurrido. La visita caduca **seis horas después de comenzar**. Al completar un pedido de invitado, su recibo deja de persistirse; con el perfil de muestra se conserva en el historial. “Reiniciar datos de la demo”, en Mi perfil, borra el estado del restaurante. Si el almacenamiento está bloqueado se ofrece el mismo recorrido en memoria con un aviso.

No hay cuentas autenticadas, servidor de pedidos, sincronización entre dispositivos, gestión real de mesas o cocina, pagos, correos ni facturación. No existe seguimiento móvil externo mediante Live Activities, notificaciones o servicios en segundo plano. Una implementación real requiere esos servicios y confirmación de disponibilidad por parte del negocio. El prototipo nunca debe usarse como ficha nutricional o de alérgenos de un restaurante.

Las imágenes y fuentes del restaurante se sirven localmente. Las fotos son referencias de banco, sin afirmar que pertenezcan a un restaurante real. Las dos galerías usan tomas del mismo plato. La ensalada y el queso incorporan en su receta de ejemplo las verduras visibles; se conservan sus precios y los identificadores anteriores de configuración. Ninguna foto cambia al quitar ingredientes: no es una representación dinámica de cada personalización. La portada y Psicólogo conservan sus proveedores externos y sus preferencias independientes. Véanse [recursos](docs/RECURSOS_RESTAURANTE.md), [mapa](docs/MAPA_RESTAURANTE.md) y [estado de V4.2.5](docs/ESTADO_V4.2.5.md).


## Respuesta visual de V4.2.4

Las entradas de página conservan el texto plenamente opaco y duran 200 ms; los resultados filtrados, 160 ms; las fotografías y avisos, 180 ms; el indicador del carrito, 320 ms. No hay autoplay ni animaciones continuas nuevas. Las entradas anteriores se retiran inmediatamente: nunca coexisten páginas ocultas con botones enfocables. Cambiar parámetros de búsqueda no remonta la página ni el buscador; actualizar el contador tampoco reinicia las galerías.

`prefers-reduced-motion` desactiva estas animaciones, incluso si se cambia durante una visita. La confirmación escrita y el número de productos siguen visibles. El foco va al título al cambiar de página, al carrito tras añadir un producto y al buscador al recuperar una búsqueda vacía. Las fotografías conservan el marco cuadrado de la carta o 4:3 del producto, con `object-fit: contain`. Las segundas vistas se precargan cuando su galería se aproxima a la pantalla.

## Comprobación opcional en navegador

Con Edge instalado en Windows, después del build:

```bash
DEMO_START_PREVIEW=1 DEMO_BROWSER_CHANNEL=msedge npm run test:browser:restaurante
DEMO_START_PREVIEW=1 DEMO_BROWSER_CHANNEL=msedge npm run test:browser:restaurante:v423
DEMO_START_PREVIEW=1 DEMO_BROWSER_CHANNEL=msedge npm run test:browser:restaurante:v424
DEMO_START_PREVIEW=1 DEMO_BROWSER_CHANNEL=msedge npm run test:browser:restaurante:v425
```

El script inicia y cierra su propia vista previa de producción. También admite Chrome con `DEMO_BROWSER_CHANNEL=chrome` o un Chromium instalado con `npx playwright install chromium`, omitiendo la variable de canal.

Para Psicólogo, deja `npm run dev` en otra terminal y ejecuta:

```bash
DEMO_BROWSER_CHANNEL=msedge npm run test:browser
```

Los scripts admiten `DEMO_BASE_URL`, `DEMO_BROWSER_EXECUTABLE` y `DEMO_TEST_OUTPUT`. Los scripts admiten además `DEMO_TEST_FIXTURES`, que permite usar copias exactas de recursos externos en entornos de prueba sin acceso a sus proveedores. Las capturas y resultados se guardan en `test-results/`, fuera de Git. Véase [validación](docs/VALIDACION_V4.2.5.md) para resultados y límites.

## Estructura

| Ruta | Contenido |
|---|---|
| `src/pages/` | Directorio temporal y página 404 |
| `src/giros/psicologo/` | Cuatro temas aprobados y recorridos propios |
| `src/giros/restaurante/pages/` | Inicio, Carta, Locales, ficha de local y Conócenos |
| `src/giros/restaurante/data/` | Carta, ingredientes, precios y reservas |
| `src/giros/restaurante/state/` | Visitas, pedidos, recuperación y perfil local |
| `src/giros/restaurante/components/` | Galerías, personalización, modalidades, seguimiento, contador y perfil |
| `src/components/shared/` | Diálogos, banner, WhatsApp y contacto comercial |
| `public/restaurante/` | Imágenes, fuentes, procedencia y licencias |
| `tests/` y `scripts/` | Comprobaciones de estado, integración y navegador |
| `docs/` | Estado y validación de las entregas |

El proveedor del restaurante vive por encima de las rutas para conservar su visita y contador. Las páginas completas de ambos giros siguen cargándose de forma diferida. Sus estilos mantienen prefijos propios.

## Actualización y publicación

El ZIP incluye la fuente completa directamente en su carpeta raíz y un actualizador incremental desde el commit base indicado. Requiere un árbol limpio, conserva el historial y crea `actualizacion/v4.2.4`. No hace commits ni publica. Consulta `LEEME_PRIMERO.md` dentro del ZIP.

Se conserva `vercel.json`. Revisa localmente antes de hacer merge y push a la rama de producción. La portada comercial, el configurador de paquetes y el CV siguen para después de terminar las demos. La aplicación continúa como SPA; no se han añadido tarjetas sociales prerenderizadas por ruta.

El build informa un módulo de mapa mayor de 500 kB (aprox. 285 kB gzip más worker). Es una dependencia diferida: no se descarga antes de abrir un mapa. Se conserva el aviso de Vite para no ocultar este costo.

El comando anterior `test:browser:restaurante:v422` se mantiene como alias de la comprobación de locales, QR y regresiones sobre la navegación actual. Los escenarios comparten utilidades en `scripts/restaurant-browser.mjs`; `DEMO_SCENARIO` permite filtrar por expresión regular durante el diagnóstico.

# Multiples_Demos · V4.2.4

Portafolio de demos interactivas de **Ian Habid Aldana Martínez**.

- Repositorio: https://github.com/NaiCort/Multiples_Demos
- Despliegue habitual: https://multiples-demos.vercel.app/
- Base: V4.2.3 publicada por Ian, commit `672a7739f0c11a947a96b0b11a93c6f9eb077e2c`.
- Fecha de esta candidata: 15 de octubre de 2026. Pendiente de revisión de Ian y publicación.

V4.2.4 pule **Patio 12**, la primera identidad del giro Restaurante: fotografías coherentes, galerías con desplazamiento breve, transiciones de páginas y filtros, y confirmación visible al añadir o editar el pedido. Conserva las páginas, carta configurable, combos, mapa, QR y seguimiento de V4.2.3. La portada sigue como directorio temporal y Psicólogo conserva sus cuatro temas aprobados. Las demás identidades de Restaurante y la gestión de empleados siguen pendientes; Café, Gimnasio, Taller, Despacho y Revista continúan como “Próximamente”.

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
| `/restaurante/carta` | Los doce productos, categorías, filtros, búsqueda y personalización |
| `/restaurante/locales` | Mapa general bajo demanda, filtro de ciudad y ocho fichas debajo |
| `/restaurante/locales/:pointId` | Ficha propia, reserva, pedido, mapa y QR de cada local |
| `/restaurante/conocenos` | Concepto, valores y equipo ficticio identificado como ejemplo |
| `/restaurante/pedido` | Carrito, edición y confirmación de pedido |
| `/restaurante/seguimiento` | Espera de mesa, etapas, recibo y cierre de la misma visita |

No se bloquea Inicio con una ventana automática. Se elige modalidad en Inicio o al personalizar el primer producto. Los filtros de Carta usan parámetros `categoria`, `preferencia` y `buscar`; el regreso desde el carrito conserva la última URL de Carta. Las rutas admiten acceso directo, recarga y navegación atrás/adelante. Una ruta inexistente ofrece recuperación sin borrar la sesión. El antiguo enlace `?seguimiento=...` continúa hacia la página de seguimiento; `punto` y `mesa` siguen validados.

## Recorridos de Patio 12

- **Modalidad:** comer aquí, para llevar o a domicilio desde Inicio o el selector de la barra. Se permite explorar como invitado y cambiar modalidad antes de confirmar un pedido.
- **Comer aquí:** espera de 60 segundos, exploración y configuración durante la espera, botón para saltarla y mesa ficticia del 1 al 25. La mesa se asigna una vez y habilita añadir platos. La reserva futura mantiene su recorrido independiente.
- **Carta:** doce productos con fotografía, nombre y descripción a su lado; categorías, búsqueda sin acentos y filtros de receta base vegetariana, vegana o con carne. Ensalada y hamburguesa tienen dos fotografías de una misma presentación, controles y deslizamiento táctil. Pasta conserva su toma con pesto; se retira la segunda imagen que mostraba otra receta.
- **Configuración:** cantidades normales, reducidas, aparte o sin el ingrediente; sustituciones, extras ilustrados y cantidad. Se añaden porciones en sopa, pasta y tacos; proteína/guarnición donde la receta lo admite; tamaños de bebidas y temperatura de café. Los cuatro platos principales admiten combos de entrada pequeña y bebida, con suplementos visibles. La receta base conserva los ingredientes que definen el plato. Precio, nutrientes y alérgenos incluyen también los cambios de porción y los componentes del combo; las cifras se señalan expresamente como ficticias.
- **Pedido:** carrito editable, máximo nueve unidades de cada combinación y recibo con los cambios exactos. Se identifica la mesa o turno. El envío usa tres zonas ficticias con distancia, tiempo orientativo y tarifa, más un escenario fuera de cobertura que impide confirmar. La dirección escrita no se geocodifica.
- **Seguimiento:** 30 segundos de preparación y 10–30 segundos de ruta acelerados, avance automático, saltos de prueba, recogida/entrega y cierre. En producción estos estados dependerían de la cocina y del reparto.
- **Perfil opcional:** Alex Demo, visitas ficticias iniciales, categorías de beneficio, descuentos sobre los platos y hasta diez recibos locales. Solo un pedido finalizado suma una visita. Existe vista previa del correo y explicación de factura; no se envían mensajes ni se emite CFDI.
- **Pago:** efectivo o digital simulados, disponibles también para invitados. No se solicita tarjeta ni se realiza un cobro.
- **Contador:** tarjeta rectangular semitransparente, arrastre con ratón o tacto, cuatro esquinas accesibles por botones, minimización y posición adaptable. Aparece compacto al cambiar de giro o ir al portafolio; tocarlo recupera la misma visita.
- **Ventana externa opcional:** Document Picture-in-Picture, cuando el navegador la expone. Puede mostrar el seguimiento fuera de la pestaña y ofrecer el retorno. Al cerrar la pestaña también termina esta ventana. No se promete una superposición externa en iOS/Android.
- **Reserva futura, WhatsApp, ubicación, privacidad, guía y contacto comercial:** conservan sus recorridos propios. Las acciones del restaurante son ficticias; los canales de contacto con Ian son reales.

## Mapa y accesos de demostración

Ocho referencias geográficas en Xalapa, CDMX (dos), Puebla, Mérida, Guadalajara, Monterrey y Tijuana. No son sucursales. El mapa usa MapLibre GL JS y cartografía pública de OpenFreeMap, con atribución a OpenMapTiles/OpenStreetMap. El motor, worker, estilos y teselas se solicitan al pulsar **Mostrar mapa interactivo**. La selección manual sigue funcionando sin WebGL o ante un fallo del proveedor. En Locales, el mapa general precede a las ocho fichas y sus marcadores permiten explorar cada referencia. Los puntos cercanos se agrupan al alejar el mapa; pulsar el grupo acerca la vista para separarlos. El filtro de ciudad reduce tanto las fichas como los marcadores. Cada ficha tiene su propia página, mapa y generador QR.

Los destinos, trazos y cobertura de 5 km son ilustrativos y preparados. No hay tráfico, geocodificación de domicilios ni GPS de reparto. La flecha avanza según el estado y las fechas del mismo pedido. Se separan preparación, recorrido y total orientativo; el reloj usa segundos acelerados para la demo. El punto queda fijo al confirmar aunque después se explore otra ciudad.

**Usar mi ubicación** es opcional y solicita permiso solo al pulsarlo. Busca la referencia más cercana en línea recta; no determina cobertura real ni guarda la coordenada. La selección manual funciona si se deniega el permiso o vence el tiempo.

El generador QR permite copiar un enlace o descargar un PNG. Solo incluye `punto` y, opcionalmente, `mesa` entre 1 y 25. El enlace normal conserva la elección de modalidad y espera de 60 segundos. El QR de mesa representa a alguien ya sentado y evita esa espera; no sustituye una visita activa. No comparte pedidos ni perfiles entre dispositivos. Los enlaces usan el origen donde se abre el sitio: un QR de localhost solo funciona allí; para compartirlo hay que generarlo desde el despliegue publicado.

Reservas, horas y recibos usan el huso del punto, incluido `America/Tijuana`. Los puntos son referencias aproximadas de OpenStreetMap, sin afirmar accesos concretos. No se crean fichas de negocios ni datos estructurados que los presenten como establecimientos.

## Estado local y límites

**Selección inicial: CDMX · Chapultepec**, para todas las modalidades. Explorar un local o mover el mapa no cambia el local del pedido. Se elige explícitamente desde la barra, una ficha o la confirmación del pedido. Cambiar de local antes de confirmar conserva los platos; si se estaba comiendo aquí, reinicia la espera y asignación de mesa en el nuevo local. Un pedido confirmado conserva su local hasta terminar. Una reserva futura puede elegir otro local de manera independiente. La carta, precios e ingredientes son comunes en los ocho escenarios; no se simula inventario por sucursal.

El punto elegido, visita activa, carrito, pedido, perfil de muestra y posición se guardan en `localStorage` bajo `patio12-demo-v1`. Se migra de esquema 1 a 2 conservando la sesión V4.2.1; los registros del esquema 1 sin punto y los recibos históricos sin punto se asocian a Xalapa. Una sesión válida con local elegido lo conserva; cambiar el valor inicial a CDMX no traslada pedidos existentes. Los contadores usan fechas de finalización, por lo que recargar o regresar actualiza el tiempo transcurrido. La visita caduca **seis horas después de comenzar**. Al completar un pedido de invitado, su recibo deja de persistirse; con el perfil de muestra se conserva en el historial. “Reiniciar datos de la demo”, en Mi perfil, borra el estado del restaurante. Si el almacenamiento está bloqueado se ofrece el mismo recorrido en memoria con un aviso.

No hay cuentas autenticadas, servidor de pedidos, sincronización entre dispositivos, gestión real de mesas o cocina, pagos, correos ni facturación. No existe seguimiento móvil externo mediante Live Activities, notificaciones o servicios en segundo plano. Una implementación real requiere esos servicios y confirmación de disponibilidad por parte del negocio. El prototipo nunca debe usarse como ficha nutricional o de alérgenos de un restaurante.

Las imágenes y fuentes del restaurante se sirven localmente. Las fotos son referencias de banco, sin afirmar que pertenezcan a un restaurante real. Las dos galerías usan tomas del mismo plato. La ensalada y el queso incorporan en su receta de ejemplo las verduras visibles; se conservan sus precios y los identificadores anteriores de configuración. Ninguna foto cambia al quitar ingredientes: no es una representación dinámica de cada personalización. La portada y Psicólogo conservan sus proveedores externos y sus preferencias independientes. Véanse [recursos](docs/RECURSOS_RESTAURANTE.md), [mapa](docs/MAPA_RESTAURANTE.md) y [estado de V4.2.4](docs/ESTADO_V4.2.4.md).


## Respuesta visual de V4.2.4

Las entradas de página conservan el texto plenamente opaco y duran 200 ms; los resultados filtrados, 160 ms; las fotografías y avisos, 180 ms; el indicador del carrito, 320 ms. No hay autoplay ni animaciones continuas nuevas. Las entradas anteriores se retiran inmediatamente: nunca coexisten páginas ocultas con botones enfocables. Cambiar parámetros de búsqueda no remonta la página ni el buscador; actualizar el contador tampoco reinicia las galerías.

`prefers-reduced-motion` desactiva estas animaciones, incluso si se cambia durante una visita. La confirmación escrita y el número de productos siguen visibles. El foco va al título al cambiar de página, al carrito tras añadir un producto y al buscador al recuperar una búsqueda vacía. Las fotografías conservan el marco cuadrado de la carta o 4:3 del producto, con `object-fit: contain`. Las segundas vistas se precargan cuando su galería se aproxima a la pantalla.

## Comprobación opcional en navegador

Con Edge instalado en Windows, después del build:

```bash
DEMO_START_PREVIEW=1 DEMO_BROWSER_CHANNEL=msedge npm run test:browser:restaurante
DEMO_START_PREVIEW=1 DEMO_BROWSER_CHANNEL=msedge npm run test:browser:restaurante:v423
DEMO_START_PREVIEW=1 DEMO_BROWSER_CHANNEL=msedge npm run test:browser:restaurante:v424
```

El script inicia y cierra su propia vista previa de producción. También admite Chrome con `DEMO_BROWSER_CHANNEL=chrome` o un Chromium instalado con `npx playwright install chromium`, omitiendo la variable de canal.

Para Psicólogo, deja `npm run dev` en otra terminal y ejecuta:

```bash
DEMO_BROWSER_CHANNEL=msedge npm run test:browser
```

Los scripts admiten `DEMO_BASE_URL`, `DEMO_BROWSER_EXECUTABLE` y `DEMO_TEST_OUTPUT`. Los scripts admiten además `DEMO_TEST_FIXTURES`, que permite usar copias exactas de recursos externos en entornos de prueba sin acceso a sus proveedores. Las capturas y resultados se guardan en `test-results/`, fuera de Git. Véase [validación](docs/VALIDACION_V4.2.4.md) para resultados y límites.

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

# Mapa y QR de Patio 12

Implementación: `data/locations.js`, `components/DemoMap.jsx`, `components/mapEngine.js`, `components/LocationExplorer.jsx` y `components/EntryPanel.jsx`. Estado y vínculo del pedido: `state/model.js`.

## Referencias

Consulta manual de OpenStreetMap/Nominatim el 15 de octubre de 2026, con solicitudes espaciadas y coordenadas conservadas en el código. La aplicación no llama a Nominatim. Las coordenadas son referencias aproximadas del parque/plaza, no de un acceso, sucursal o cocina.

| Punto | Referencia | Coordenadas (longitud, latitud) | Elemento OSM |
|---|---|---|---|
| xalapa | Parque Juárez | -96.9237455, 19.5265862 | [way/691364227](https://www.openstreetmap.org/way/691364227) |
| chapultepec | Bosque de Chapultepec, primera sección | -99.1881929, 19.4218002 | [node/9041879851](https://www.openstreetmap.org/node/9041879851) |
| alameda | Alameda Central | -99.1439908, 19.4357156 | [way/4758957](https://www.openstreetmap.org/way/4758957) |
| puebla | Zócalo / Plaza de la Constitución | -98.1981095, 19.0436856 | [way/528509571](https://www.openstreetmap.org/way/528509571) |
| merida | Plaza Grande | -89.6237445, 20.9670748 | [way/1296783856](https://www.openstreetmap.org/way/1296783856) |
| guadalajara | Parque Agua Azul | -103.3481931, 20.6598678 | [relation/13589817](https://www.openstreetmap.org/relation/13589817) |
| monterrey | Parque Fundidora | -100.2821860, 25.6771028 | [way/30987006](https://www.openstreetmap.org/way/30987006) |
| tijuana | Parque Morelos | -116.9387316, 32.4989374 | [way/161454528](https://www.openstreetmap.org/way/161454528) |

## Carga y recuperación

El mapa se abre bajo acción explícita. Se importa MapLibre GL JS 6.14.0 en un módulo diferido y su worker se sirve desde el build de Vite. El mapa se destruye al cerrar/cambiar el escenario; actualizar el segundo del reloj solo mueve el marcador. Se evita el zoom con rueda que secuestra el scroll mediante gestos cooperativos.

El proveedor público es `https://tiles.openfreemap.org/styles/liberty`, sin clave incorporada al cliente. Se conservan la atribución del estilo y enlaces visibles a OpenFreeMap, OpenMapTiles y OpenStreetMap. Un fallo de módulo, red, WebGL o un tiempo de carga mayor de 15 segundos ofrece reintento y selección manual. No se ocultan los avisos de tamaño de Vite.

Los trazos son polilíneas ilustrativas preparadas a partir de cada referencia. Los valores de 1, 3 y 5 km y 10, 20 y 30 min son escenarios ficticios; la ruta no valida calles, sentidos, acceso, tráfico ni disponibilidad. La zona de 8 km está fuera de cobertura y no se confirma. La preparación se muestra como 20–30 min, separada del recorrido; para probar se comprime a 30 segundos y un segundo por minuto ficticio de ruta. El círculo de cobertura representa 5 km en línea recta y no un área comercial real.

El pedido guarda `pointId` y `zoneId`. Explorar otro punto no los cambia. Las fechas absolutas, `travelStartedAt` y `arrivalDeadline` permiten recuperar el avance tras una recarga. El perfil conserva recibos con el mismo punto/huso. El esquema anterior sigue admitido.

## Ubicación y QR

Solo Usar mi ubicación invoca `navigator.geolocation.getCurrentPosition`, sin seguimiento continuo ni alta precisión. El permiso denegado, la ausencia de API y el tiempo agotado dejan disponible la lista manual. Se calcula la distancia de círculo máximo para comparar las ocho referencias; nunca se interpreta como ruta o cobertura. La coordenada no se almacena, ni se manda a un servicio de geocodificación.

QR con qrcode 1.5.4, carga diferida al generar, salida PNG y enlace copiable. Solo incluye `punto` y opcionalmente `mesa`. No contiene nombre, dirección, identificador de pedido, perfil o pago. La mesa se valida como entero de 1 a 25; su confirmación simula a alguien ya sentado. Se conserva cualquier visita activa. Cada dispositivo tiene su propia sesión. No equivale a autorización de mesa para producción.

## Fuentes técnicas y licencias

- [Guía de OpenFreeMap y configuración para Vite](https://openfreemap.org/quick_start/).
- [Documentación de MapLibre](https://maplibre.org/maplibre-gl-js/docs/) y [GeoJSON](https://maplibre.org/maplibre-gl-js/docs/examples/add-a-geojson-line/).
- [Créditos de OpenStreetMap](https://www.openstreetmap.org/copyright).
- [qrcode, repositorio oficial](https://github.com/soldair/node-qrcode).
- Licencias de MapLibre y qrcode conservadas en `public/restaurante/licencias/`. Las licencias originales de fuentes y fotos siguen en sus registros previos.

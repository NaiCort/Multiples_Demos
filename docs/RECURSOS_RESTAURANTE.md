# Recursos de Patio 12

Las fotografías y fuentes de Patio 12 se sirven desde public/restaurante. El mapa de V4.2.2 consulta cartografía externa al abrirlo; los estilos generales del portafolio conservan sus proveedores previos. Fotografías ilustrativas; no se afirma que muestren un negocio real ni cada ingrediente de la carta.

| Archivo | Origen |
|---|---|
| pasta.webp | https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1000&q=82&fm=webp |
| hamburguesa.webp | https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1000&q=82&fm=webp |
| ensalada.webp | https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=82&fm=webp |
| patio.webp | https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1400&q=65&fm=webp |

Descargados el 5 de octubre de 2026 bajo la licencia pública de Unsplash: https://unsplash.com/license. La licencia permite incorporar las fotografías al prototipo; no permite venderlas sin modificación significativa ni replicar un servicio competidor de imágenes.

Bitter y DM Sans provienen de Google Fonts. Se incluyen sus licencias SIL Open Font License en LICENSE-bitter.txt y LICENSE-dmsans.txt; fuentes originales en https://github.com/google/fonts/tree/main/ofl/bitter y https://github.com/google/fonts/tree/main/ofl/dmsans. Se conserva la respuesta CSS de origen en fuentes-origen.css.txt. Los alias CSS Patio Bitter y Patio Sans aíslan su uso en esta demo; no modifican el contenido de los archivos de fuente.

Para un cliente, sustituir imágenes y textos de muestra por materiales autorizados y representativos de su restaurante. La demo no presenta estas fotografías como trabajo para un cliente ni como imágenes de un restaurante real. Algunas referencias pueden contener marcas de productos; no implican una relación comercial.

## Fotografías añadidas en V4.2.1

En la entrega V4.2.1, cada producto recibió una fotografía local; ensalada, pasta y hamburguesa tenían dos vistas de referencia. La revisión vigente se describe al final de este documento. Los extras incluyen imágenes orientativas. Se conserva el encuadre completo con `object-fit: contain`, sin estirar las fotografías. Las recetas, ingredientes y cifras nutricionales son ejemplos ficticios independientes de las fotografías.

El registro [fotos-origen-v4.2.1.json](../public/restaurante/fotos-origen-v4.2.1.json) conserva la URL de descarga, la página y autor cuando fueron identificados, las dimensiones y la huella del archivo. Las imágenes nuevas se descargaron el 8 de octubre de 2026 bajo la [licencia de Unsplash](https://unsplash.com/license).

| Archivo | Autor o referencia |
|---|---|
| `sopa.webp` | sunorwind |
| `flan.webp` | J. Luis Esquivel |
| `queso.webp` | Ahmet Koç |
| `pollo.webp` | Angela Bailey |
| `pastel.webp` | Jennifer Pallian |
| `limonada.webp` | Rajasekhar R |
| `agua.webp` | Anshu A |
| `tacos.webp` | Jarritos Mexican Soda |
| `cafe.webp` | Gerson Cifuentes |
| `pasta-2.webp` | Referencia de Unsplash; URL en el registro |
| `hamburguesa-2.webp` | Referencia de Unsplash; URL en el registro |
| `ensalada-2.webp` | Referencia de Unsplash; URL en el registro |
| `aguacate.webp` | Referencia de Unsplash; URL en el registro |
| `hongos.webp` | engin akyurt |
| `tocino.webp` | Donald Giannatti |

Para producción se necesitan fotos de la misma receta y de sus variantes, además de información de ingredientes, alérgenos y nutrición validada por el establecimiento. Las fotografías de muestra no permiten inferir esos datos.

## Mapa y QR añadidos en V4.2.2

MapLibre GL JS 6.14.0 (BSD-3-Clause) y qrcode 1.5.4 (MIT), instalados mediante npm. Se conservan los textos íntegros de ambas licencias en `public/restaurante/licencias/`; se publican junto con el sitio. No se añadieron fotografías nuevas para esta entrega.

OpenFreeMap sirve la cartografía pública del mapa bajo demanda. Se conservan sus atribuciones a OpenMapTiles y OpenStreetMap, tanto dentro del mapa como en texto accesible. Las referencias de coordenadas y el carácter ficticio de rutas/cobertura se explican en [Mapa de Restaurante](MAPA_RESTAURANTE.md). No se redistribuye una base de datos de teselas con el proyecto.

## Revisión fotográfica de V4.2.4

El registro [fotos-origen-v4.2.4.json](../public/restaurante/fotos-origen-v4.2.4.json) contiene los seis archivos actuales que sustituyen fotos de versiones anteriores: URL, ficha pública, autor, licencia, fecha, dimensiones y SHA-256. Descargados el 15 de octubre de 2026 bajo la [licencia de Pexels](https://www.pexels.com/license/). Se verificaron fichas publicadas y aprobadas; no se incluyen archivos rechazados o sin ficha pública vigente. No se generaron fotografías con IA.

| Archivos actuales | Autor | Criterio |
|---|---|---|
| `ensalada.webp`, `ensalada-2.webp` | Kevser Köroğlu | Dos tomas de la misma ensalada y plato |
| `hamburguesa.webp`, `hamburguesa-2.webp` | Jhonny Salas Brochero | Plato y vista cercana de la misma hamburguesa |
| `queso.webp` | Anca | Queso horneado con verduras, sin confundirlo con otra entrada |
| `cafe.webp` | Pratikxox | Café negro servido desde una jarra |

La receta ficticia de ensalada añade zanahoria, betabel y rábano; el queso añade champiñones y espinaca. Se conservan sus precios, ingredientes previos e identificadores de configuración. La información nutricional se sigue calculando a partir de cantidades ficticias, no de las fotografías. Las fotos ilustran la preparación base y no se transforman al retirar o añadir ingredientes. Se retira la imagen del plato de queso como extra: no representaba una porción aislada de queso.

`pasta.webp` conserva su origen y licencia de Unsplash. Se retira `pasta-2.webp` porque mostraba otra receta; la galería no anuncia una segunda toma que no existe. Los demás archivos conservan su procedencia anterior. El registro V4.2.1 es histórico: sus huellas describen aquella entrega, no los seis archivos sustituidos ahora.

Pexels permite su uso en un sitio o aplicación; no se atribuye respaldo de los autores, de las personas o de las marcas visibles. Las fotografías forman parte del prototipo y no se ofrecen como una biblioteca de imágenes ni como material de un restaurante real. Para un cliente se usarán fotos autorizadas de sus propias recetas y porciones.

# Referencias de los locales · V4.2.5

Los puntos son aproximaciones geográficas para mostrar fichas, filtros, mapas y QR. **Patio 12 no tiene establecimientos en estos parques o plazas.** No se ofrecen direcciones de negocios, inventario, horarios ni cobertura reales. Los horarios y platillos son ejemplos independientes de los reglamentos o servicios de los parques.

Se conservan los ocho identificadores y referencias previos. Se incorporan ocho puntos, contrastando su nombre y ciudad con fuentes municipales o turísticas y sus coordenadas aproximadas con OpenStreetMap/Nominatim. En San Cristóbal se usa el área de Parque Central, asociada a Plaza 31 de Marzo; no los resultados de comercios con «Plaza Diez» en su nombre.

| País / estado | Ciudad / identificador | Parque o plaza de referencia | Fuente de nombre y ubicación |
|---|---|---|---|
| México · Oaxaca | Oaxaca de Juárez · `oaxaca` | Paseo Juárez · El Llano | [Turismo de Oaxaca](https://oaxaca.travel/index.php/en-us/component/jevents/eventdetail/343/31%2C38/-) · [OSM](https://www.openstreetmap.org/way/30050283) |
| México · Chiapas | San Cristóbal de las Casas · `chiapas` | Plaza 31 de Marzo / Parque Central | [Gobierno de Chiapas](https://www.chiapas.gob.mx/pueblos-magicos/san-cristobal/) · [Ayuntamiento](https://www.sancristobal.gob.mx/informacion-transparencia/ciudad/1/catedral-de-san-cristobal/) · [OSM](https://www.openstreetmap.org/way/1363465371) |
| México · Querétaro | Santiago de Querétaro · `queretaro` | Alameda Hidalgo | [Turismo de Querétaro](https://queretaro.travel/eventos/recorrido-caminalee/) · [OSM](https://www.openstreetmap.org/relation/4122123) |
| México · Guanajuato | Guanajuato · `guanajuato` | Jardín de la Unión | [Turismo de Guanajuato](https://guanajuato.mx/ciudad-patrimonio/atractivos/jardin-union-el-corazon-cultural-de-guanajuato/) · [OSM](https://www.openstreetmap.org/way/27356583) |
| Estados Unidos · Texas | Austin · `austin` | Zilker Metropolitan Park | [Austin Parks](https://www.austintexas.gov/parks/locations/zilker-metropolitan-park) · [OSM](https://www.openstreetmap.org/relation/13307353) |
| Estados Unidos · Texas | San Antonio · `san-antonio` | Brackenridge Park | [San Antonio Parks](https://www.sa.gov/Directory/Departments/Parks/Parks-Facilities/Parks/Directory/Brackenridge-Park) · [OSM](https://www.openstreetmap.org/way/132057360) |
| Estados Unidos · California | Los Angeles · `los-angeles` | Griffith Park | [Los Angeles Recreation and Parks](https://www2.laparks.org/park/griffith) · [OSM](https://www.openstreetmap.org/relation/7091174) |
| Estados Unidos · California | San Francisco · `san-francisco` | Golden Gate Park | [San Francisco Recreation and Parks](https://www.sfrecpark.org/770/Golden-Gate-Park) · [OSM](https://www.openstreetmap.org/way/158602261) |

## Datos y comportamiento

`locations.js` define países, estados y puntos. `pointsInArea` alimenta tanto el directorio como el mapa; `locationFilters` valida los parámetros y descarta combinaciones incompatibles. No hay dos listas de locales independientes que puedan discrepar. El detalle de cada ficha sigue usando su identificador previo, con acceso directo y QR validado.

Los locales de Texas usan `America/Chicago` y los de California `America/Los_Angeles`; el formateo usa el huso IANA, incluido el horario estacional de la fecha, sin fijar manualmente una diferencia horaria. Las nuevas coordenadas son referencias al área del parque o plaza, no entradas, accesos, restaurantes o puntos de reparto.

El proveedor cartográfico, las atribuciones y la carga bajo demanda se conservan. La cobertura de entrega y el trazo siguen siendo ilustrativos. Un cambio de país no activa moneda extranjera, traducción ni condiciones comerciales reales.

# Ficha de identidad · Ladera (Café, V4.3)

Ficha escrita antes del código, según la Guía de identidad y calidad visual v1.1
(Documento Maestro, Parte X). Fecha: 12 de noviembre de 2026. Estado: propuesta para
revisión de Ian.

## Concepto

**Ladera, café de altura.** Cafetería y tostador ficticio con **un solo local** en Xalapa,
Veracruz. Trabaja con lotes de fincas de la región (Coatepec, Xico, Teocelo y Huatusco)
y presenta cada café como una ficha de lote: productor, finca, altitud, proceso, notas
de taza y precio. Todos los datos son ficticios y se declaran así.

- **Idea propia del giro:** la altura y la ladera de la montaña. Se expresa con **curvas
  de nivel** dibujadas en SVG; cada lote tiene la suya, derivada de su altitud.
- **Modo (Impeccable):** Persuade en Inicio; Operate en Carta y Pedido; Read en Origen y
  Prepara en casa.
- **Escena de uso:** de día, con prisa o con calma, muchas veces desde el teléfono en la
  fila o camino al local. Por eso el sitio es **claro y luminoso**, no oscuro.
- **Fuera de alcance:** gestión de empleados (descartada el 12/11/2026), varios locales,
  envío a domicilio, cuentas reales y pagos.

## Paleta

| Rol | Nombre | Hex | Dónde se usa |
|---|---|---|---|
| Neutro | Papel | `#F8F8F5` | Fondo general. Blanco apenas cálido, nunca crema. |
| Superficie | Papel alto | `#FFFFFF` | Fichas de lote, panel de pedido. |
| Dominante | Tinta | `#1C1B19` | Texto, títulos, líneas de curvas de nivel, botones secundarios. |
| Texto secundario | Tinta media | `#5E5B55` | Metadatos y ayudas. Contraste ≥ 4.5:1 sobre Papel. |
| Línea | Hilo | `#D9D6CE` | Separadores de 1 px y cuadrícula de fichas. |
| Acento | Cereza | `#B0182E` | **Solo lo que se puede pedir o confirmar**: botón principal, precio en el panel de pedido, estado "lista". Nunca decorativo. |

**Colores de lote:** cada lote tiene un tono propio que vive solo en su curva de nivel
más alta y en una marca cuadrada junto a su nombre; nunca como borde de la ficha (patrón
vigilado), en la navegación ni en botones: Durazno
`#E3A07A`, Ciruela `#6B3A5B`, Miel `#C9952F`, Pizarra `#4E6170`. Texto siempre en Tinta.

## Tipografía

- **Títulos y etiquetas:** Archivo (variable, eje de anchura). Condensada (`wdth` 62–75)
  en peso 700–800 para títulos; ancho normal en 500 para etiquetas y botones.
- **Texto:** Source Serif 4 (variable, tamaños ópticos), 400 y 600.
- Ambas con licencia OFL, **servidas desde el propio sitio** en woff2, como en Patio 12.
- Cifras tabulares (`font-variant-numeric: tabular-nums`) en precios, altitudes, tiempos
  y gramos. Nada de monoespaciada para los datos.
- Escala: título de Inicio entre 4.5 y 6rem; texto 1.0625rem; medida de 60 a 70
  caracteres; tracking de títulos −0.02em.
- Sin mayúsculas sostenidas en títulos; etiquetas en versalitas solo dentro de la ficha
  de lote.

## Forma, radios y sombras

- Esquinas de 2 px en botones y fichas; píldora completa solo en los modificadores de
  bebida (leche, shots, azúcar).
- Profundidad por superficies (Papel, Papel alto) y hilos de 1 px. Una sola sombra, la
  del panel de pedido flotante: `0 8px 24px rgba(28, 27, 25, 0.12)`.
- La ficha de lote es una hoja técnica: datos en dos columnas con hilos, no una tarjeta
  con ícono.

## Movimiento

- **Momento propio:** al entrar a Inicio y a cada ficha de lote, las curvas de nivel se
  dibujan una vez (trazo de 1.2 s como máximo, `cubic-bezier(0.23, 1, 0.32, 1)`).
- **Temporizador de preparación** (Prepara en casa): el avance y los vertidos responden
  al botón de iniciar; no es decoración.
- **Vapor:** solo en la confirmación "tu bebida está lista", tres trazos breves.
- Interfaz: 200 ms con ease-out; presionar 120 ms con escala 0.97; entradas desde 0.95.
- Movimiento reducido: las curvas aparecen ya dibujadas, el vapor se reemplaza por un
  fundido, y el temporizador sigue contando sin animar.
- Sin aparición hacia arriba en cada sección y sin cinta deslizante (ya la usa Patio 12).

## Densidad

- Inicio: aire generoso, una idea por pantalla.
- Carta y Pedido: densa y escaneable, como una lista de precios.
- Ficha de lote: compacta, datos alineados en columnas.
- El espacio vertical varía por sección según el contenido.

## Anclas visuales

- **SEY Coffee** (Brooklyn): espacio en blanco severo, etiquetas condensadas,
  explicaciones en serif, hoja de origen junto a la taza.
- **Onyx Coffee Lab**: transparencia por lote (precio, productor, perfil) y sitio como
  laboratorio con guías de preparación.
- **Blue Bottle Coffee**: cafés ordenados por método de preparación; tono cercano y no
  pomposo.
- Referencia de contenido, no visual: los cafés de tercera ola de Xalapa y Coatepec, que
  muestran productor, altitud y puntaje de cata.

## Patrones prohibidos en Ladera

- Fondos crema, beige o café; textura de papel kraft; modo oscuro.
- Mesh gradient, manchas de luz y brillos (se descarta lo que el catálogo de la sección
  16 proponía para café).
- Granos, tazas o arte latte como ilustración o íconos decorativos; emojis.
- Vapor en el hero.
- Monoespaciada como disfraz de "técnico".
- Etiqueta sobre el título, serif cursiva como acento, numeración 01/02/03 decorativa
  (los pasos del temporizador sí llevan número porque el orden importa).
- Cinta deslizante de especialidades.
- Tipografía manuscrita o de pizarrón.
- Fotografías generadas con IA. Solo fotografía real con licencia, autor y procedencia
  registrados, servida desde el sitio.
- Lucide solo para controles funcionales (carrito, cerrar, ubicación, reloj).

## Páginas y recorridos

Rutas bajo `/cafe`, con su propio estado dentro de la ruta (sin proveedor global):

| Página | Contenido | Recorrido simulado (5 estados) |
|---|---|---|
| Inicio | Concepto, lote de la semana, horario y ubicación visibles sin desplazarse | — |
| Carta | Bebidas por método (espresso, filtrado, frías, sin café) y bolsas de grano | Pedido para recoger: modificadores, hora exacta de entrega, "tu bebida está lista" |
| Origen | Fichas de lote con curvas de nivel y datos de finca | Comprar bolsa de grano con molienda según método |
| Prepara en casa | Guías por método | Temporizador de preparación funcional |
| Visítanos | Un local: dirección, horario, mapa estático o enlace, tarjeta de visitas | Reservar lugar en una cata de los sábados |

Componentes compartidos que se reutilizan: DemoBanner, WaterMark, ComercialCTA,
WhatsAppPreview, DemoConfirmation. Ladera tiene su propio estilo en cada uno.

## Plan de entregas

1. **V4.3.0:** ruta `/cafe`, fuentes, tokens de la paleta, Inicio y favicon.
2. **V4.3.1:** Carta y pedido para recoger.
3. **V4.3.2:** Origen con curvas de nivel y compra de grano.
4. **V4.3.3:** Prepara en casa con temporizador.
5. **V4.3.4:** Visítanos, cata, pasada final (conteo de patrones, Impeccable,
   web-design-guidelines, Core Web Vitals, móvil) y documentos de validación.

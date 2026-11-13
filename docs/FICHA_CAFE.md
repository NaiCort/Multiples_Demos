# Ficha de identidad · Ladera (Café, V4.3) · versión 2, «Tueste»

Guía de identidad y calidad visual v1.1 (Documento Maestro, Parte X). Versión 1: 12 de
noviembre de 2026, ficha técnica minimalista (V4.3.0–V4.3.4). **Versión 2: 13 de
noviembre de 2026**, dirección «Tueste» elegida por Ian entre tres maquetas (V4.3.5).

## Por qué cambió

La versión 1 tomó como anclas a tostadores de especialidad (SEY, Onyx) y resultó fría
para una cafetería: sin fotos, casi monocromática y sin mostrar el lugar. La
investigación «Cafeterías: color, sitio web y animación que sí funciona» mostró que un
sitio de café vende primero el lugar: fotografía real, tonos cálidos y claros, carta a un
toque e información para quedarse. La versión 2 conserva todas las funciones y el motivo
de altura, y los vuelve cálidos.

## Concepto

**Ladera, café de altura.** Cafetería y tostador ficticio con **un solo local** en Xalapa.
Lotes de fincas de Coatepec, Xico, Teocelo y Huatusco, presentados como fichas con
productor, altitud, proceso, notas y precio. Todos los datos son ficticios.

- **Idea propia del giro:** el relieve de la finca coloreado con la **escala de tueste**,
  del grano verde en lo bajo al tostado oscuro, con la cereza (o el color del lote) en la
  cima. Todos los mapas usan la misma escala (una línea cada 50 m; la cima es la altitud
  del lote) y se explican una sola vez, en Inicio. El color es un guiño al tueste, no un
  dato: el tueste no depende de la altitud.
- **Escena de uso:** de día, desde el teléfono en la fila o con calma en una mesa. Claro y
  cálido, nunca oscuro.
- **Fuera de alcance:** gestión de empleados, varios locales, envío a domicilio, cuentas
  y pagos reales.

## Paleta

| Rol | Nombre | Hex | Dónde se usa |
|---|---|---|---|
| Neutro | Papel cálido | `#F7F1E8` | Fondo general. Decisión consciente: luz cálida, no el beige de plantilla. |
| Superficie | Papel alto | `#FFFBF5` | Fichas, temporizador, tarjeta de visitas. |
| Dominante | Tostado | `#2A1E19` | Texto, botones secundarios, llamada comercial. |
| Texto secundario | Tostado medio | `#6B5A50` | Metadatos. Contraste 5.8:1 sobre Papel cálido. |
| Línea | Hilo | `#E2D6C4` | Separadores de 1 px. |
| Acento | Cereza | `#A3162B` | Lo que se pide o confirma y **una banda por página** (la cinta del día). Contraste 6.9:1. |

**Escala de tueste** (solo en relieves): `#E3E0C4`, `#E8D3A8`, `#E2BC88`, `#D6A06A`,
`#C2834F`, `#A8683F`, `#8A4F33`, `#6E3B26`. **Colores de lote** (cima del relieve y marca
junto al nombre): Durazno `#E3A07A`, Ciruela `#6B3A5B`, Miel `#C9952F`, Pizarra `#4E6170`.

## Tipografía

- **Títulos:** Source Serif 4, peso 600, tamaño óptico de cartel. Serif con carácter, sin
  palabras en cursiva como acento.
- **Texto:** Source Serif 4, 400.
- **Navegación, botones, etiquetas y cifras:** Archivo (ancho normal; condensada solo en
  el logotipo). Cifras tabulares en precios, horas y altitudes.
- Ambas servidas desde el sitio, licencia OFL.

## Fotografía

Once fotos de Wikimedia Commons (CC0, CC BY, CC BY-SA y dominio público), reducidas a
1280 y 640 px en WebP, con autor, licencia y huella en `public/cafe/fotos/fotos-origen.json`
y créditos en `/cafe/creditos`. Ilustran el ambiente; no se presentan como Ladera ni como
lugares de Xalapa. La foto principal y las de encabezado cargan con prioridad.

## Forma, sombras y densidad

- Esquinas de 2 px; píldora solo en modificadores y botón «Agregar».
- Una sombra suave (`0 8px 24px` al 12–14 %) para la etiqueta sobre la foto y el panel de
  pedido. Profundidad por superficies.
- Portada con aire; carta y pedido densos; fichas compactas.

## Movimiento

- **Momento propio:** el relieve se colorea franja por franja al entrar en pantalla
  (1.2 s como máximo).
- **Cinta del día** en cereza: se desplaza despacio, se puede detener, y con movimiento
  reducido queda quieta y sin botón.
- Temporizador real, vapor solo en «tu pedido está listo», 200 ms con ease-out en la
  interfaz, 120 ms al presionar, leve acercamiento (1.02) de las fotos de «Lo que más se
  pide» al pasar el puntero.

## Anclas

- Recopilaciones 2026 de sitios de café (Zarla, CreateToday): foto real del lugar,
  cálido y luminoso, carta a un toque.
- Onyx Coffee Lab: transparencia por lote (se conserva en las fichas).
- Cartografía de relieve con tintas hipsométricas (Patterson): el degradado como dato.

## Patrones vigilados permitidos con motivo

Fondo cálido, serif expresiva en títulos, cinta deslizante con contenido real y relieve
con tintas por altura (cartografía, no degradado decorativo).

## Patrones prohibidos

Modo oscuro, vidrio, brillos y manchas de luz, etiqueta sobre el título, palabra en
cursiva como acento, tarjetas iguales con ícono, borde de color en un lado, cifras de
relleno, imágenes generadas con IA, carruseles automáticos, granos o tazas como
ilustración decorativa, emojis, monoespaciada como adorno.

## Páginas

| Página | Ruta | Fotos |
|---|---|---|
| Inicio | `/cafe` | interior, latte, cortado, gotero, salón |
| La carta y pedido | `/cafe/carta`, `/cafe/pedido` | espresso, gotero, tostador |
| Origen | `/cafe/origen` | cerezas, secado, escala de tueste |
| Prepara en casa | `/cafe/prepara` | gotero |
| Visítanos | `/cafe/visitanos` | ventana |
| Créditos | `/cafe/creditos` | todas, en miniatura |

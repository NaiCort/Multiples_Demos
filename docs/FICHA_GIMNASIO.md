# Ficha de identidad · Brío (Gimnasio, V4.4)

Guía de identidad y calidad visual v1.1 (Documento Maestro, Parte X). Versión 1: 14 de
noviembre de 2026. Dirección «Combinada» elegida por Ian a partir de tres maquetas
(Placa, Distrito y Pase), con dos agregados: video en lugar de fotos fijas y un segundo
tema de color.

Investigación previa: «Gimnasios: cómo funcionan sus sitios y apps» (Claude Docs), con
marcas reales (Smart Fit, Sports World, Planet Fitness, Orangetheory, Equinox, Anytime
Fitness, Barry's, PureGym, Wellhub, Gymbox) y las 13 referencias de Awwwards que eligió Ian.

## Concepto

**Brío, club de entrenamiento con cinco sucursales** en una ciudad sin nombre. Una
membresía abre todas. Clases con coaches de planta, área de socio y tienda. Todo es
ficticio: sucursales, coaches, socios, precios y productos.

- **Idea propia del giro:** el **disco de pesas** como objeto de firma. Es el logotipo
  en grande, el marco de la portada y el color de acento (azul de 20 kg).
- **Tres caracteres, una marca:** la portada y los planes (claros, con el disco); las
  sucursales y las clases (franja oscura, mapa dibujado y video en blanco y negro); el
  área de socio (aspecto de app, con teléfono).
- **Escena de uso:** desde el teléfono, antes de salir o en la fila del torniquete:
  qué tan lleno está, a qué hora es la clase, el pase para entrar.
- **Fuera de alcance:** gestión de empleados, cuentas y pagos reales, datos de salud de
  quien visita la demo, conexión real con relojes o apps de salud.

## Decisiones de Ian (14/11/2026)

- Gimnasio y club de varias sucursales, con clases y entrenadores.
- Tres membresías: básica (máquinas, regaderas y locker), intermedia (además clases y
  coach) y premium (todo, más productos incluidos y servicios que justifiquen el precio).
- Inicio de sesión simulado con un perfil ya creado; muestra lo que un visitante no ve.
- Datos de salud solo del perfil de ejemplo. La demo no pide datos de salud.
- Tienda completa con pocos productos.
- Fotos fijas sustituidas por video de personas entrenando, con los mismos filtros.
- Un segundo tema que use la paleta de Distrito sobre la misma estructura.

## Temas

Una sola estructura y dos paletas, cambiadas con variables de CSS (sin duplicar
componentes, a diferencia de Psicólogo). El selector va en la esquina, como en Psicólogo,
pero es propio de Brío: no se toca el `ThemeSwitcher` compartido de una demo cerrada. La
elección se guarda en el navegador (`brio-tema-v1`).

### Cobalto (predeterminado)

| Rol | Nombre | Hex | Dónde se usa | Contraste |
|---|---|---|---|---|
| Neutro | Gis | `#ECE8E1` | Fondo de portada, socio y planes | — |
| Superficie | Gis alto | `#F6F3EE` | Tabla de planes, fichas, pantalla del teléfono | — |
| Dominante | Hule | `#16171A` | Texto, bordes, franja oscura (`#141518`) | 14.7:1 sobre Gis |
| Texto secundario | Grafito | `#5D5E63` | Metadatos | 5.3:1 sobre Gis |
| Línea | Junta | `#D3CEC4` | Separadores de 1 px | — |
| Acento | Cobalto | `#1F47C9` | Disco, acción principal, plan destacado, etiqueta de hora | 6.1:1 sobre Gis; blanco sobre Cobalto 7.5:1 |
| Acento en oscuro | Cobalto claro | `#6A8CFF` | Sucursal elegida y pin del mapa en la franja oscura | 5.9:1 sobre `#141518` |
| Tinte | Cobalto pálido | `#E4E9FA` | Columna del plan destacado, aviso de tienda | Cobalto sobre tinte 6.2:1 |

### Distrito

| Rol | Nombre | Hex | Dónde se usa | Contraste |
|---|---|---|---|---|
| Neutro | Carbón | `#141312` | Fondo general | — |
| Superficie | Carbón alto | `#1C1A18` | Franja de sucursales y clases | — |
| Dominante | Hueso | `#EDE8DF` | Texto sobre carbón; fondo de planes y de la pantalla del teléfono | 15.2:1 |
| Texto secundario | Piedra | `#A39C90` | Metadatos sobre carbón (`#6B655C` sobre hueso) | 6.8:1 y 4.7:1 |
| Línea | Junta oscura | `#34302B` | Separadores | — |
| Acento | Terracota | `#B8431F` | Botones, disco, plan destacado | Blanco sobre terracota 5.4:1; terracota sobre hueso 4.5:1 |
| Acento en oscuro | Terracota claro | `#E0683F` | Títulos destacados y pin sobre carbón | 5.5:1 |

Regla del acento, en ambos temas: un solo color de acento por pantalla; marca lo que se
pide, se reserva o está elegido. Nunca degradados con él.

## Tipografía

- **Títulos y cifras grandes:** Anybody (variable, eje de ancho 50–150 %). El ancho
  cambia de carácter: extendida en la portada y los planes (112–150 %), angosta en
  sucursales y clases (55–80 %), normal en el área de socio (90 %).
- **Texto, navegación y botones:** Public Sans (variable).
- Cifras tabulares en precios, horas, aforo y minutos. Ambas OFL, servidas desde el sitio
  con precarga, para evitar el salto de tipografía medido en Ladera.
- Las mismas dos familias en los dos temas.

## Video y fotografía

- **Video corto en bucle** en lugar de fotos fijas: clases (combate, fuerza, ciclo,
  movilidad) y encabezados de Sucursales y Clases. **No GIF:** un GIF de 6 s pesa varias
  veces lo que un MP4 y no se puede pausar.
- Fuente: Wikimedia Commons, solo dominio público, CC0, CC BY y CC BY-SA, con autor,
  licencia y huella en `public/gimnasio/medios-origen.json` y créditos en su página.
  Candidatos encontrados: entrenamiento de box (Rumble in the Deid, dominio público),
  peso muerto y powerlifting (dominio público), kettlebell (CC BY-SA), ciclo en grupo
  (CC BY), salto de cuerda (CC BY-SA).
- **Formato:** 4–8 s, sin audio, 720 px de ancho, H.264 en MP4 (y WebM si ahorra peso).
  Meta: 400–800 KB por clip. Póster WebP de 1280 y 640 px.
- **Filtro:** blanco y negro con más contraste (`grayscale(1) contrast(1.1)`), igual que
  las fotos de la maqueta, en los dos temas. El color lo pone la interfaz, no el video.
- **Reglas:** `muted`, `playsinline`, `loop`, `preload="none"`. Solo se reproduce el
  video que está en pantalla. Un botón visible detiene todos los videos. Con movimiento
  reducido o ahorro de datos se muestra solo el póster. Nada de video en la portada
  (ahí está el disco), para no castigar la carga inicial.
- Los videos ilustran el ambiente; no se presentan como Brío ni como sus coaches.

## Forma, sombras y densidad

- Botones en píldora; tarjetas de 18 px; tabla de planes de 24 px; teléfono de 52 px.
- Una sombra suave para lo que flota (ficha del mapa, tarjetas junto al teléfono,
  aviso). Profundidad por superficies.
- Portada con aire; horario, planes y tienda densos.

## Movimiento

- **Momento propio:** el disco gira al desplazarse (rotación ligada al scroll, SVG,
  sin WebGL). Con movimiento reducido queda quieto.
- Pase QR que se renueva cada 30 s con una cuenta visible.
- Tarjetas de planes que se apilan al desplazarse en teléfono.
- Aforo que se actualiza con una transición corta.
- Interfaz: 200–300 ms, ease-out, entradas desde 0.95, fundido con movimiento reducido.

## Anclas

- Phive: objeto propio del gimnasio como firma y «elige tu club» como momento central.
- Temple Noble Art: sucursales en un mapa dibujado de la ciudad.
- Fenriz y Locomotion: fotografía en blanco y negro con un solo acento; clases con
  nombre propio.
- Fitonist: la app como protagonista, con el teléfono fijo.
- Gymbox: categorías de clase con nombre y lo que incluye la membresía dicho sin rodeos.

## Patrones vigilados permitidos con motivo

Fondo oscuro en la franja de sucursales y clases (y en todo el tema Distrito), letra
extendida y angosta como carácter, tarjetas sobre foto con velo oscuro para leer el
texto (función, no adorno).

## Patrones prohibidos

Cuenta regresiva de ofertas (y menos una que se reinicia sola, como la de Gymbox),
urgencia falsa, rojo y negro de plantilla, neón, brillos y manchas de luz, degradados
decorativos, cuerpos de banco de imágenes como portada, etiqueta sobre el título,
numeración 01–05 decorativa, tres tarjetas iguales con ícono arriba, filas de
palomitas en los planes, carruseles automáticos, emojis, imágenes generadas con IA.

## Páginas previstas

| Página | Ruta | Contenido |
|---|---|---|
| Inicio | `/gimnasio` | Disco, aforo ahora, mapa, clases de esta noche, socio, planes |
| Sucursales | `/gimnasio/sucursales` | Mapa, ficha de cada sucursal, aforo por hora |
| Clases | `/gimnasio/clases` | Horario filtrable, reserva con lugar, lista de espera |
| Planes | `/gimnasio/planes` | Comparador, alta en pasos, cancelación en un paso |
| Coaches | `/gimnasio/coaches` | Fichas, evaluación gratuita, paquetes de sesiones |
| Tienda | `/gimnasio/tienda` | Catálogo corto, producto, carrito, recoger en sucursal |
| Socio | `/gimnasio/socio` | Inicio de sesión de ejemplo, pase, reservas, semana, InBody, cancelar |
| Créditos | `/gimnasio/creditos` | Videos y fotos con autor y licencia |

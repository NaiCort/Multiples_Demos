# Historial de cambios

## V4.2.2 · 2026-10-15

Base: V4.2.1 publicada (`53118a2d698327c30d8e5b6e4ed398e5358668ec`). Candidata para revisión de Ian; no se publica automáticamente ni se cierra el giro completo.

- Identidad de Patio 12 con sello propio, carta numerada, contador de fotos y entrada con ajustes secundarios desplegables.
- Porciones, proteína y guarnición según receta; tamaños de bebidas, temperatura de café, dulzor/hielo y combos de entrada pequeña más bebida con suplementos. Precio, clasificación, nutrientes y alérgenos consideran la configuración completa.
- Ocho puntos de demostración en siete ciudades mexicanas: referencias geográficas reales, sin presentarlas como sucursales. Selector compacto en teléfono y lista en escritorio.
- Mapa MapLibre/OpenFreeMap bajo demanda, worker local, atribuciones visibles, cobertura y trazos ficticios preparados, y recuperación ante fallos de red o WebGL.
- Geolocalización opcional bajo acción explícita, referencia más cercana en línea recta, sin persistir la coordenada.
- Pedido vinculado al punto al confirmar; preparación, ruta y total separados; avance del marcador según el mismo reloj y botón Avanzar simulación. Rechazo de entregas fuera de cobertura también en el modelo.
- Enlaces y QR descargables para puntos y mesas 1–25; QR de mesa ya ocupada separado de la espera normal, recuperación de enlaces inválidos y protección de la visita activa.
- Fechas, horas y recibos con huso del punto; migración del almacenamiento anterior sin perder su visita o perfil.
- Pruebas de integración y navegador para controles, mapa, QR, cobertura, precios, recuperación y accesibilidad. Se conserva Psicólogo y la portada temporal.

## V4.2.1 · 2026-10-08

Base: V4.2.0 publicada (`4cf4dc8b50e849aaaa7a23187fb89902b35332dc`), con source-map-js 1.2.2. Candidata para revisión de Ian; amplía Patio 12 y no cierra todavía todo el giro Restaurante.

- Se añade la elección inicial de comer aquí, para llevar o a domicilio y se conserva la reserva futura independiente.
- La espera de mesa dura un minuto, permite explorar y saltar la demostración, asigna una mesa del 1 al 25 una sola vez y habilita el pedido al terminar.
- Los doce productos tienen fotos locales, nombre y descripción a su lado. Tres productos tienen galería manual y deslizamiento táctil.
- Se añaden filtros de receta base, ingredientes, nutrientes y alérgenos ficticios, modificaciones de cantidades, retiro, extras ilustrados y sustituciones. El carrito conserva y permite editar cada configuración.
- El pedido distingue mesa, turno o entrega por zona ficticia, informa tarifa y tiempos y avanza por preparación, recogida/ruta y cierre simulados.
- El perfil opcional de ejemplo incorpora beneficios, visitas y recibos locales; pago digital ficticio disponible también para invitados, con vista de correo y explicación de factura sin emitir documentos fiscales.
- La visita y pedido se recuperan al recargar, con contadores basados en fechas de finalización, caducidad de seis horas y recuperación ante almacenamiento bloqueado.
- Contador rectangular semitransparente, arrastre táctil/ratón, esquinas, minimización, posición guardada y retorno a la misma visita desde otras rutas.
- Ventana externa opcional mediante Document Picture-in-Picture, con retorno y recuperación visible cuando el navegador rechaza la apertura. Termina junto con su pestaña.
- Se amplían las pruebas y la documentación de calidad, estado y procedencia de recursos. Se conserva la corrección de dependencias de la base.
- La portada temporal, los cuatro temas de Psicólogo y las identidades futuras mantienen el alcance acordado.

## V4.2.0 · 2026-10-05

Base: V4.1.3 (`d3c393cbc06eac8685f00911b7b3f17f6f606bd8`). Psicólogo aprobado por Ian el 2 de octubre. Primera entrega de Restaurante, pendiente de revisión.

- Se añade `/restaurante` con carga diferida y se habilita su entrada en el directorio temporal.
- Patio 12 tiene identidad, contenido, tipografía y composición propios de un restaurante de barrio.
- Carta con categorías, búsqueda, estado vacío y 12 productos con precios e ingredientes de ejemplo.
- Carrito en memoria con extras, cantidades, límite de nueve unidades por combinación, retiro de productos, recogida y entrega simuladas, totales y recibo.
- Reserva de mesa con fechas futuras, cierre de lunes, disponibilidad por tamaño de grupo e invalidación del horario al corregir la selección.
- WhatsApp adaptado al restaurante; ubicación ficticia, privacidad, ayuda y contacto comercial real.
- Fotografías WebP y fuentes WOFF2 locales con licencias; nombres de fuente aislados de otros giros.
- Navegación compartida admite IDs por giro y DemoBanner admite una guía propia. Los valores predeterminados de Psicólogo se conservan.
- Se añaden seis pruebas unitarias y recorridos de navegador de Restaurante. Los resultados y límites están en docs/VALIDACION_V4.2.md.
- Las otras identidades de Restaurante y la gestión de empleados continúan como entregas posteriores; no se cierra el giro completo.

## V4.1.3 · 2026-10-02

Base: V4.1.2 (`f08237f26916b619929b3f3b6230caac17032696`). Candidata al cierre de Psicólogo, pendiente del visto bueno de Ian.

- “Agendar” abre la reserva simulada; las acciones identificadas como WhatsApp conservan la conversación de demostración. Se armonizan el menú de Cálido y los iconos de reserva.
- Los diálogos mantienen el recorrido circular de Tab y Shift+Tab, Escape, aislamiento del fondo y devolución de foco.
- Al elegir una sección del menú, el foco continúa desde su encabezado. El indicador activo considera la altura del encabezado fijo.
- El retrato de Cálido se adapta a pantallas estrechas. La sala mantiene la solución 4:3 aprobada en V4.1.2.
- Se mejora el contraste de textos secundarios, números y pie de página. La llamada a reservar de Minimalista también se ve sin hover.
- Se amplían a 44 px los controles de menú, carrusel y privacidad y se añade espacio de desplazamiento para el foco.
- La clase de botones respeta las utilidades responsive: el menú móvil se oculta en escritorio.
- El selector retira el oscurecimiento al confirmar un tema y distingue ratón de uso táctil. El hover respeta movimiento reducido.
- La cédula de Minimalista se identifica como ejemplo. Su encabezado animado conserva espacios reales entre palabras.
- Se actualiza brace-expansion para corregir el aviso de seguridad detectado.
- Se añaden recorridos reproducibles de navegador con Playwright y axe-core como herramientas de desarrollo.
- Se conservan la portada temporal, los canales comerciales y el alcance de los giros futuros.

## V4.1.2 · 2026-09-09

Base: V4.1.1.

- La fotografía de la sala conserva su proporción original 4:3 en Cálido, Minimalista, Clínico y Naturaleza. El ancho es adaptable y la altura se calcula automáticamente.
- Se eliminan las alturas fijas y el recorte por `object-cover` de esa imagen. Sus dimensiones HTML reservan el espacio antes de que termine de cargar.
- La máscara ovalada de la sala en Naturaleza se sustituye por esquinas suaves para conservar el encuadre completo.
- La tarjeta de experiencia de Cálido pasa debajo de la fotografía para no cubrirla ni sobresalir hacia el borde de la pantalla.
- El archivo de dependencias incorpora la actualización de Browserslist y baseline-browser-mapping comprobada después de V4.1.1.
- Se mantiene el resto del alcance y las correcciones de V4.1.1.

## V4.1.1 · 2026-09-08

Base: V4.1 (`a39c869b4cbaff136aee282f434eae53a8818144`).

### Correcciones funcionales

- Todos los accesos al WhatsApp del negocio ficticio abren la conversación simulada. Se eliminan los enlaces al número de ejemplo.
- Las reservas invalidan modalidad y horario al cambiar de servicio. La orientación psicológica solo admite Online.
- La reserva permite cambiar servicio desde una preselección y después de reiniciar.
- Los controles se bloquean durante el procesamiento y los temporizadores se cancelan al cerrar o desmontar.
- Cada apertura del chat comienza con estado propio; desaparecen las carreras entre cierre, respuesta y reapertura.
- Los formularios comparten validación, etiquetas, errores asociados, estado de procesamiento y recuperación de foco.
- Se añade relleno con datos ficticios y se evita solicitar detalles de salud para probar el formulario.
- La navegación detecta la posición al montar un tema y vuelve a marcar Inicio cuando corresponde.
- Se añade una página 404, un estado visible de carga y recuperación ante fallos de carga de la aplicación.
- Las preferencias de tema inválidas o el almacenamiento bloqueado utilizan un tema válido de respaldo.

### Accesibilidad y presentación

- Diálogos nativos con nombre accesible, Escape, aislamiento del fondo, bloqueo del desplazamiento y devolución de foco.
- Menú móvil con el mismo mecanismo de diálogo y navegación de escritorio reservada a pantallas suficientemente anchas.
- Objetivos de 44 px en el selector y botones de icono; nombres y selección comunicados a tecnologías de asistencia.
- Indicador de foco, enlaces para saltar al contenido y regiones principales.
- Contraste mejorado en textos secundarios, formularios, acciones y diálogos oscuros.
- Se respeta la preferencia de movimiento reducido, incluidos desenfoques, desplazamientos y animaciones repetidas.
- La guía deja de aparecer automáticamente y pasa al botón “Cómo funciona”.
- Se ajusta el espacio inferior para el selector y la marca de agua.

### Coherencia del contenido

- Servicios, duración y modalidades comparten reglas entre temas.
- Se identifica el perfil, las credenciales y las reseñas como ejemplos ficticios.
- Se sustituye el título “Dra.” y se armoniza el enfoque del perfil de ejemplo.
- Las cifras de pacientes/satisfacción se sustituyen por información sobre servicios, duración y modalidades.
- La imagen etiquetada como consultorio se sustituye por una sala de referencia.
- Se elimina “Ver el caso de estudio”, que llevaba al formulario ficticio.
- El aviso de la demo describe el almacenamiento opcional y las solicitudes a proveedores externos.
- Se actualizan título y descripción al cambiar de ruta.

### Mantenimiento

- Versión del paquete 4.1.1, README propio, documentación de estado y validación.
- 21 pruebas de regresión e integración con Vitest, React y JSDOM.
- Dependencias de producción conservadas; herramientas de prueba añadidas con versión fijada.
- Se conserva la portada temporal y las cuatro identidades visuales. No se añaden giros, configurador comercial ni CV.

## V4.1 · 2026-08-26

Migración a carpetas por giro y carga diferida del código de psicología.

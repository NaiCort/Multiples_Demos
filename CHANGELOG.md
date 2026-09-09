# Historial de cambios

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

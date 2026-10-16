# Estado de V4.2.4

Candidata de Patio 12 del 15 de octubre de 2026, sobre V4.2.3 publicada: `672a7739f0c11a947a96b0b11a93c6f9eb077e2c`. Pendiente del visto bueno de Ian en su equipo. No se hace commit, push ni publicación automáticos.

## Revisión propuesta

1. **Fotografías:** explorar los doce productos. Ensalada y hamburguesa muestran dos tomas de la misma presentación. Queso al horno muestra queso con verduras y café americano muestra café negro. Pasta conserva la fotografía con pesto: se retiró la segunda porque mostraba otra receta. Las demás fotos siguen siendo ilustrativas.
2. **Ingredientes:** la ensalada incorpora zanahoria, betabel y rábano; el queso, champiñones y espinaca, de acuerdo con las nuevas fotos. Se conservan sus precios y los identificadores anteriores de configuración. Se pueden ajustar las verduras nuevas. Las cifras nutricionales siguen siendo ejemplos y no se deducen de las imágenes. Las fotos no se transforman al personalizar.
3. **Galerías:** usar flechas, puntos y deslizamiento táctil en carta y producto. La transición sigue la dirección elegida, conserva el foco del control y no altera el tamaño del marco. La carta conserva miniaturas cuadradas; el producto, marco 4:3 y fotografía completa. No hay autoplay. Las segundas vistas se precargan cuando su galería se acerca a la pantalla.
4. **Páginas y filtros:** navegar por Inicio, Carta, Locales, fichas, Conócenos, Pedido y Seguimiento. La entrada dura 200 ms y enfoca el título; filtrar actualiza solo resultados durante 160 ms y conserva el buscador. Recuperar una búsqueda vacía devuelve el foco a ese campo.
5. **Carrito:** añadir un plato, repetirlo y editarlo. El aviso confirma la acción con texto e icono; el número del carrito da un único pulso. El foco vuelve al botón del pedido. El mensaje puede cerrarse. No se añade un artículo duplicado al editar ni se reinicia la visita al navegar.
6. **Movimiento reducido:** activar la opción del sistema y repetir página, filtro, galería y carrito. La información debe actualizarse inmediatamente, conservando el texto, la confirmación y el foco. La preferencia también funciona si cambia con la demo abierta.
7. **Regresiones:** probar comer aquí, minuto/salto y mesa; para llevar; domicilio, cobertura y cierre; combos, perfil y recibos; reserva futura independiente; selección de local; mapas bajo demanda y QR. Recargar y visitar el portafolio debe conservar la misma visita mientras sea válida.

## Criterio de cierre de esta entrega

Se requiere validación técnica aprobada, revisión visual de Ian en escritorio y un teléfono real, y ausencia de bloqueos en los recorridos anteriores. Pasar pruebas automatizadas no sustituye ese visto bueno. Esta versión prepara el cierre visual de Patio 12; no declara finalizadas las demás identidades del giro Restaurante.

## Alcance conservado

Portada temporal, Psicólogo aprobado, doce productos y ocho referencias geográficas ficticias. La carta es común a todos los puntos. Se conserva la clave y esquema del almacenamiento, las fechas de los temporizadores y los contratos de las rutas. Los ingredientes añadidos no retiran las personalizaciones anteriores; los precios no cambian.

Pagos, direcciones, disponibilidad, perfiles, beneficios, reservas y reparto siguen simulados. No se agregan cuentas reales, backend, gestión de personal, paneles administrativos, traducciones completas, notificaciones móviles ni nuevas identidades visuales. La portada comercial y el CV mantienen su lugar después de las demos.

Las fuentes de imágenes están en [Recursos](RECURSOS_RESTAURANTE.md); la arquitectura de mapa y QR, en [Mapa](MAPA_RESTAURANTE.md); los resultados y límites, en [Validación](VALIDACION_V4.2.4.md).

# Estado de V4.3.1 · Carta y pedido para recoger

Segunda entrega de Ladera, 12 de noviembre de 2026. Base: V4.3.0 en `main` (`cfb86df`).

## Construido

- **La carta** (`/cafe/carta`): 16 productos en cinco secciones por método (Espresso, Filtrado, Fríos, Sin café, Para acompañar), con enlaces de salto, precios en cifras tabulares y un botón "Agregar" por producto.
- **Personalización** en ventana: leche (avena y almendra +$15), shots extra (+$18, hasta dos), azúcar, lote para los filtrados y cantidad. El precio del botón se actualiza al elegir.
- **Aviso** tras agregar, con enlace al pedido; se cierra solo a los seis segundos.
- **Pedido para recoger** (`/cafe/pedido`): cantidades, eliminar líneas, total, nombre para el vaso con validación, hora de recogida calculada con el horario del local (lo antes posible y cada 15 minutos; si ya cerró, el siguiente día) y "Enviando a la barra…" de 800 ms.
- **Seguimiento**: número de pedido, nombre, hora y tres etapas (Recibido, En la barra, Lista para recoger) en un minuto, declarado como simulación acelerada. Al estar listo aparece el vapor, y "Ya lo recogí" cierra el recorrido con la opción de hacer otro pedido.
- El carrito y el pedido se conservan al recargar; mientras hay un pedido en barra no se puede empezar otro.
- Inicio: botón principal "Pedir para recoger" en cereza; WhatsApp pasa a la sección del local.
- El color cereza aparece solo en lo que se pide o se confirma: botón principal, botón de agregar, total y estado "listo".

## Pendiente de esta entrega

**Fotografías de la carta.** El entorno no permite buscar en Unsplash ni en Pexels sin autorización. Hace falta una de dos fuentes: una clave gratuita de la API de Unsplash, o permitir Wikimedia Commons. La carta ya funciona sin fotos y sus filas pueden recibirlas sin cambiar el diseño.

## Qué revisar en la vista previa

1. `/cafe/carta` en el teléfono: secciones, precios y botones "Agregar".
2. Personalizar un latte con avena y un shot; ver el precio del botón ($103 MXN).
3. Agregar un Gotero V60 eligiendo otro lote; abrir Pedido y cambiar cantidades.
4. Confirmar sin nombre (debe pedirlo), luego con nombre; esperar un minuto a "Tu pedido está listo" y pulsar "Ya lo recogí".
5. Recargar durante el seguimiento: el pedido debe seguir ahí.

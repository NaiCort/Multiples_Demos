# Estado de V4.3.0 · Ladera, primera entrega

Primera entrega del giro Café, 12 de noviembre de 2026. Base: V4.2.5 en `main` (`059db30`). Ficha de identidad: [FICHA_CAFE.md](FICHA_CAFE.md).

## Construido

- Ruta `/cafe/*` con carga diferida y su propio estado dentro de la ruta; ninguna pieza de Ladera envuelve al resto del sitio.
- Fuentes Archivo y Source Serif 4 servidas desde `public/cafe`, con sus licencias OFL.
- Inicio: título, horario y ubicación visibles en la primera pantalla; curvas de nivel del lote de la semana; ficha técnica de El Encino; lista de los otros tres lotes; horario de ejemplo de un solo local.
- Curvas de nivel generadas a partir de una semilla fija: una línea cada 50 m desde 800 m hasta la altitud del lote, cima en el color del lote, trazo de 1.2 s como máximo y dibujo inmediato con movimiento reducido.
- WhatsApp simulado con mensajes propios de Ladera, llamada comercial real, banner de demo, guía "Cómo funciona" y marca de agua.

## No incluido todavía

Carta y pedido para recoger (V4.3.1), Origen y compra de grano (V4.3.2), Prepara en casa (V4.3.3), Visítanos con cata y pasada final (V4.3.4). Por eso la navegación solo muestra Inicio.

**La Bienvenida no enlaza todavía a Café**: Ladera se publica en `/cafe` para revisarla en la vista previa, y se habilitará en el directorio al cerrar V4.3.4. No se modificó ninguna demo cerrada; el único archivo compartido que cambia es `src/App.jsx`, para registrar la ruta.

## Qué revisar en la vista previa

1. Abrir `/cafe` en el teléfono: título, horario y ubicación en la primera pantalla; el mapa de curvas aparece debajo.
2. Ver el trazo de las curvas al cargar, y que con movimiento reducido aparecen ya dibujadas.
3. "Ver el lote de la semana" baja a la ficha; "Escribir por WhatsApp" abre la conversación simulada y se cierra.
4. Comprobar que los datos se leen como ficticios y que no hay crema, café de fondo ni modo oscuro.

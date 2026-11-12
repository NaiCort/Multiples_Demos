# Estado de V4.3.3 · Prepara en casa

Cuarta entrega de Ladera, 12 de noviembre de 2026. Base: V4.3.2 en `main` (`d75c476`).

## Construido

- **Prepara en casa** (`/cafe/prepara`, "En casa" en la navegación): cuatro métodos (gotero V60, Chemex, prensa francesa y moka) con descripción, tazas ajustables donde aplica, café y agua en gramos, proporción, molienda explicada con una comparación cotidiana, temperatura y tiempo total.
- **Temporizador real**: iniciar, pausar, continuar y reiniciar. Marca el paso actual (en cereza), el agua total que debe haber en la jarra y avanza una barra con una marca por vertido. Al terminar ofrece cómo ajustar la molienda según el sabor y "Preparar otra vez". Cambiar de método o de tazas reinicia la preparación. Los cambios de paso se anuncian a lectores de pantalla.
- "Comprar El Encino molido para…" abre la bolsa del lote de la semana con la molienda del método ya elegida.
- Encabezado: el botón del pedido sale de la navegación; en el teléfono los enlaces pasan a una segunda fila para que quepan los cuatro.

## Sigue pendiente

Fotografías de la carta: requieren una clave de la API de Unsplash o permitir Wikimedia Commons en el entorno.

## Qué revisar en la vista previa

1. `/cafe/prepara` en el teléfono: elegir Chemex, subir a tres tazas y ver que cambian los gramos.
2. Iniciar el temporizador, pausar y continuar; ver cambiar el paso actual.
3. Dejarlo terminar (unos tres minutos en V60) y pulsar "Preparar otra vez".
4. Comprar el café molido para el método elegido y verlo en Pedido.

# Estado de V4.3.2 · Origen y café en grano

Tercera entrega de Ladera, 12 de noviembre de 2026. Base: V4.3.1 en `main` (`9feaacc`).

## Construido

- **Origen** (`/cafe/origen`): perfil de altitud con los cuatro lotes sobre la misma ladera (líneas cada 100 m, trazo de la pendiente al entrar en pantalla), una ficha por lote con sus curvas de nivel, y "Cómo leer la ficha": puntaje de cata, pago al productor y los procesos lavado, honey y natural en lenguaje llano.
- **Café en grano:** nueva sección de la carta con una bolsa por lote. Se elige 250 g o 1 kg (3.6 veces el precio de 250 g, redondeado a $5) y la molienda según el método: grano entero, espresso, moka, gotero V60, Chemex o prensa francesa. La bolsa se recoge junto con el resto del pedido.
- Cada ficha de Origen tiene "Comprar bolsa" (abre la bolsa de ese lote) y "Probarlo en gotero V60" (abre el V60 con ese lote ya elegido).
- Inicio enlaza cada lote de "También en la barra" con su ficha en Origen, y la ficha de la semana con las cuatro fichas. Los enlaces con ancla llevan el foco al título del lote.
- Las curvas de nivel ahora se dibujan al entrar en pantalla, no todas al cargar la página.
- En el teléfono, la gráfica de altitud conserva un tamaño legible y se desliza dentro de su marco, con una indicación para hacerlo.

## Sigue pendiente

Fotografías de la carta: requieren una clave de la API de Unsplash o permitir Wikimedia Commons en el entorno.

## Qué revisar en la vista previa

1. `/cafe/origen` en el teléfono: deslizar la gráfica y leer las cuatro fichas.
2. "Comprar bolsa de La Joya", elegir 1 kg y prensa francesa: el botón muestra $955 MXN.
3. "Probarlo en gotero V60" en Cerro Gordo: la ventana abre con ese lote marcado.
4. En Inicio, tocar "Tres Pasos" en "También en la barra": abre Origen en su ficha.

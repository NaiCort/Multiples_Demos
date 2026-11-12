# Estado de V4.3.4 · Visítanos y cierre de Café

Quinta entrega de Ladera y cierre del giro Café, 12 de noviembre de 2026. Base: V4.3.3 en `main` (`4e025e3`). Cierre propuesto para revisión de Ian.

## Construido

- **Visítanos** (`/cafe/visitanos`): horario de ejemplo, tostado y WhatsApp simulado.
- **Tarjeta de visitas**: cada pedido recogido suma un sello (una vez por pedido); con ocho, "Canjear bebida de cortesía" vacía la tarjeta y lo avisa como simulación. Se conserva al recargar y al empezar otro pedido.
- **Cata de los sábados**: cuatro sábados siguientes, dos horarios con lugares disponibles de ejemplo, de una a cuatro personas, nombre obligatorio, "Apartando lugar…" de 800 ms y código de reserva. La reserva se guarda en el navegador; cancelarla pide confirmación.
- Inicio enlaza la cata desde la sección del local.
- **Bienvenida**: Café pasa a "Disponible" y enlaza a `/cafe`. Es el único cambio a una página fuera de Ladera, previsto para el alta de cada giro.
- Pasada final (detalle en `VALIDACION_V4.3.4.md`): deshacer al quitar una línea del pedido (el botón "menos" ya no borra), confirmación al cancelar la cata, nombres en los campos y `touch-action` en controles.

## Ladera completa

| Página | Ruta | Versión |
|---|---|---|
| Inicio | `/cafe` | V4.3.0 |
| La carta y pedido para recoger | `/cafe/carta`, `/cafe/pedido` | V4.3.1 |
| Origen y café en grano | `/cafe/origen` | V4.3.2 |
| Prepara en casa | `/cafe/prepara` | V4.3.3 |
| Visítanos, tarjeta y cata | `/cafe/visitanos` | V4.3.4 |

## Decisión sobre fotografías

Ladera se cierra **sin fotografías de producto**. Su identidad descansa en la ficha técnica, las curvas de nivel y la tipografía (como SEY, una de sus anclas), y no hubo una fuente con licencia accesible desde el entorno. Si Ian quiere fotos, se añaden en la fase de ajustes (V4.8) con una clave de la API de Unsplash o desde Wikimedia Commons, sin cambiar el diseño de las filas.

## Qué revisar en la vista previa

1. En la Bienvenida, Café aparece como disponible y abre Ladera.
2. Hacer un pedido, dejarlo listo y pulsar "Ya lo recogí": la tarjeta de Visítanos suma un sello.
3. Apartar lugar en la cata, recargar, cancelar con confirmación.
4. En Pedido, quitar una línea y pulsar "Deshacer".
5. Recorrer las cinco páginas en el teléfono.

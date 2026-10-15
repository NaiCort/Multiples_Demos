# Estado de V4.2.1

Candidata del 8 de octubre de 2026, basada en V4.2.0 publicada por Ian (`4cf4dc8b50e849aaaa7a23187fb89902b35332dc`). Patio 12 se amplía para revisión. No se anuncia todavía el cierre del giro Restaurante.

## Disponible para revisar

| Área | Comportamiento |
|---|---|
| Entrada | Tres modalidades y exploración como invitado |
| Comer aquí | Espera de 60 s, salto de prueba, aviso animado y una mesa del 1 al 25 |
| Carta | Doce productos fotografiados, tres galerías, categorías, búsqueda y filtros de receta base |
| Personalización | Quitar, reducir, servir aparte, sustituir, añadir extras y editar una configuración del carrito |
| Información del plato | Ingredientes y nutrientes ficticios; clasificación y alérgenos cambian con la configuración |
| Pedido | Mesa o turno, entrega por zona, tarifas, descuento y recibo con modificaciones |
| Seguimiento | Preparación y ruta aceleradas, estados automáticos, saltos y cierre |
| Perfil opcional | Alex Demo, dos categorías de beneficio, visitas, hasta diez recibos y vista del correo |
| Pago y factura | Pago digital ficticio sin tarjeta; explicación de factura, sin emitir CFDI |
| Contador | Arrastre, esquinas, minimización, persistencia y retorno desde otras rutas |
| Ventana externa | Document Picture-in-Picture opcional de escritorio; cierre ligado a la pestaña |
| Recuperación | Misma visita al recargar, caducidad a las seis horas y aviso si no puede guardarse |

El estado del restaurante está por encima de las rutas. La miniatura respeta el espacio del selector de Psicólogo. La portada temporal y los cuatro temas aprobados conservan su diseño y contenido.

## Revisión de Ian

1. Elegir “Comer aquí”, explorar mientras corre el minuto e intentar añadir un plato: debe permanecer bloqueado hasta recibir mesa. Probar tanto la espera completa como el salto.
2. Mover el contador con ratón y dedo, elegir esquinas, minimizarlo, girar/redimensionar la pantalla y comprobar que sigue accesible. Volver al portafolio o a Psicólogo y tocarlo para recuperar la misma mesa.
3. Explorar las doce fotos y deslizar las galerías de ensalada, pasta y hamburguesa. Revisar que los encuadres completos, el nombre y la descripción resultan cómodos en teléfono y escritorio.
4. Combinar categorías, preferencia y búsqueda. Quitar vinagreta, cambiar aderezo, añadir pollo y comprobar clasificación, nutrientes, precio y edición del mismo producto en el carrito.
5. Probar para llevar y a domicilio. Revisar turno, dirección ficticia, zona, tarifa, estimación, pago digital de prueba y recibo. Recargar durante preparación o ruta.
6. Activar el perfil de muestra, completar un pedido y comprobar que añade una visita y un recibo una sola vez. Revisar el correo de ejemplo, la explicación de factura y el reinicio de datos.
7. Probar la reserva futura, WhatsApp, guía, privacidad, menú y contacto comercial. Revisar también los cuatro temas de Psicólogo.
8. En un navegador compatible de escritorio, abrir la ventana flotante y usar “Volver a mi visita”. Si no está disponible, el contador dentro del sitio debe seguir funcionando.

## Pendiente después de esta revisión

- Ajustes de Patio 12 que Ian encuentre necesarios.
- Identidades propias para fonda/puesto, comida rápida y restaurante de lujo.
- Gestión simulada de empleados y carta en un módulo separado, todavía no disponible.
- Cierre del giro completo antes de pasar a Café/V4.3.
- Portada profesional, configurador comercial y CV, según el orden ya acordado.

## Alcance de la simulación

El perfil no es una cuenta autenticada. No hay servidor, pagos, correos, pedidos, disponibilidad de mesas, reparto, facturas ni sincronización entre dispositivos reales. Los tiempos de ruta se obtienen de zonas inventadas, no de la dirección escrita. No se han creado notificaciones, PWA, Live Activities ni una ventana externa móvil persistente.

Las fotos son ilustrativas. Los ingredientes, nutrientes y alérgenos requieren validación y fotos de las recetas reales antes de ofrecerlo a un establecimiento. La información de esta demo no debe utilizarse para decidir sobre alergias o dietas.

El actualizador prepara la revisión en una rama nueva. La publicación depende del commit, merge y push que haga Ian después de revisar.

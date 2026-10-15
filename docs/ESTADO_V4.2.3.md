# Estado de V4.2.3

Candidata del 15 de octubre de 2026 basada en V4.2.2, commit `72a4c56da2a240fd572a2fc0a84bbb51645a8560`. Sin commit ni publicación automáticos. Pendiente de revisión visual y funcional de Ian; no se declara terminado todo Restaurante.

## Revisión propuesta

1. Inicio debe presentar Patio 12 sin bloquearlo con un modal. Debe mostrar modalidades, reserva, tres destacados y accesos a locales y Conócenos.
2. La carta completa está en `/restaurante/carta`: doce productos con fotografías, nombres, descripciones, categorías, búsqueda y preferencias. Elegir el primer plato sin modalidad solicita cómo comer y luego abre ese mismo plato.
3. Configurar un plato, ir al carrito, editar y Añadir otro plato debe recuperar la búsqueda/filtros. También funcionan acceso directo y recarga de Carta con parámetros.
4. Locales muestra mapa general bajo demanda antes de las ocho fichas. CDMX tiene dos referencias. En vista nacional los puntos cercanos se agrupan para evitar botones superpuestos; pulsa el grupo para acercar. Filtrar o explorar un marcador no modifica el local del pedido.
5. Cada local tiene URL propia con información ficticia, referencia geográfica, pedido, reserva, selección, mapa y QR. Un local desconocido ofrece volver a Locales conservando el carrito.
6. Una visita nueva usa CDMX–Chapultepec; un navegador con una sesión/local guardado lo conserva. Para comprobar el valor inicial sin borrar tu visita, usa una ventana privada o Reiniciar datos de la demo.
7. Cambiar el local antes de confirmar mantiene los platos. En Comer aquí elimina la mesa anterior y reinicia la espera de un minuto; recoge/entrega conserva su sesión. Un pedido confirmado mantiene su local aunque se exploren otras ciudades.
8. Reservar desde la ficha de otro local solo afecta esa reserva futura. Cambiar local de la reserva no cambia el pedido ni su recibo.
9. Pedido y Seguimiento son páginas. El contador persiste en otras páginas y giros; al pulsarlo regresa a Seguimiento. En Seguimiento no aparece el contador duplicado.
10. Los QR de mesa 1–25, accesos inválidos, perfil, descuentos, recibos, edición, entrega, mapa de ruta y cierre conservan el comportamiento anterior. Un QR no sustituye una visita activa.
11. Conócenos presenta concepto, valores y tres personajes ficticios. No se atribuye experiencia profesional a personas reales.
12. Revisar teléfono y escritorio, navegación móvil, Tab/Shift+Tab, Escape, ausencia de desborde y fotografías. Psicólogo conserva sus cuatro temas aprobados.

## Alcance

Los locales y equipo son ficticios; los parques/plazas son referencias geográficas reales. Carta, precios e ingredientes son iguales en todos los locales de esta demo. No se añaden variaciones de existencias, cocina ni inventario por ubicación.

Los pagos, entregas, reservas y beneficios siguen siendo simulados. No hay cuentas autenticadas, backend de pedidos, geocodificación de la dirección, tráfico ni gestión real de sucursales. PWA, más identidades visuales y administración del giro siguen como entregas posteriores. La portada comercial y el CV mantienen su planificación posterior a las demos.

La cartografía sigue siendo opcional, externa y diferida. Un fallo permite continuar con la lista y el pedido. El ZIP se aplica incrementalmente desde la base indicada y conserva el historial; no debe borrarse la carpeta del repositorio.

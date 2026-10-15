# Estado de V4.2.2

Candidata del 15 de octubre de 2026 sobre V4.2.1 (`53118a2d698327c30d8e5b6e4ed398e5358668ec`). Preparada para revisión de Ian, sin commit ni publicación automáticos. Patio 12 continúa como primera identidad; no se declara cerrado todo el giro Restaurante.

## Qué revisar

1. Entrada: tres modalidades primero; punto y personas en el desplegable. Comer aquí conserva el minuto y el salto de prueba. La reserva futura sigue siendo independiente.
2. Carta: doce productos, fotografías sin estirar, indicador de vista, deslizamiento, nombre y descripción junto a cada foto. Filtros y búsqueda conservan su selección al cerrar una configuración.
3. Opciones: pasta para compartir, tacos de seis piezas, sopa grande; hamburguesa con pollo, hongos o doble res; cambio de guarnición en hamburguesa/pollo. Ingredientes retirados no cobran una sustitución que ya no se aplica.
4. Bebidas: tamaño; dulzor e hielo donde existen en la receta; café caliente o con hielo y leche opcional. No se ofrecen cambios de receta irrelevantes a todos los productos.
5. Combos: en los cuatro platos principales, añadir una entrada pequeña y bebida; cambiar componentes con suplemento visible. Revisar precio, nutrientes ficticios y resumen; editar y combinar líneas sin perder sus opciones.
6. Mapa: abrir Puntos de demostración, recorrer las ocho referencias y pulsar Mostrar mapa interactivo. En móvil se usa un selector compacto. Elegir un punto cambia la visita antes de confirmar. Explorar otra ciudad después de confirmar conserva el punto del pedido.
7. Entrega: elegir punto y zona; Fuera de cobertura debe impedir confirmar. Preparación, recorrido y total se muestran por separado. El trazo y la flecha son ilustrativos, sin GPS ni tráfico. Avanzar simulación mueve el mismo pedido y contador.
8. QR: generar y descargar un código de punto o mesa; probar `/restaurante?punto=puebla&mesa=7`. El acceso requiere pulsar la confirmación, sienta en la mesa 7 y no consume el minuto de espera. Si ya hay una visita activa, no la sustituye. Una mesa inválida permite continuar con la demo.
9. Horas: comparar Xalapa y Tijuana; la reserva y el recibo usan el huso del punto. Recargar conserva el pedido y sus plazos. Una sesión anterior V4.2.1 se migra; sus registros sin punto se asocian a Xalapa.
10. Perfil, recibos, contador móvil, retorno desde otro giro, privacidad, WhatsApp simulado y contacto comercial real conservan sus funciones. Reiniciar datos borra únicamente el estado del restaurante.

## Límites y próximas entregas

No existen sucursales en los parques. Son referencias aproximadas, sin afirmar accesos concretos. No se geocodifica una dirección escrita; cada zona tiene un destino de muestra y trazo preparado. Las cifras nutricionales, alérgenos, disponibilidad, tiempos, precios, mesas y beneficios siguen siendo ficticios.

El QR no transfiere pedidos ni autentica una mesa; la validación de una mesa real necesitaría servidor. Un QR de localhost solo se puede abrir en ese mismo entorno. Para compartirlo entre dispositivos, generarlo desde la versión desplegada.

Se conservan como entregas posteriores las otras identidades de Restaurante y el módulo de gestión; varias órdenes por visita, cuenta compartida, fidelización ampliada y recompra; PWA y funcionamiento sin conexión. Cocina, reparto, cuentas, cobros, facturas y sincronización reales requieren infraestructura aparte.

La portada comercial, el configurador de paquetes y el CV siguen para después de terminar las demos. Psicólogo mantiene su aprobación; sus archivos de aplicación no se modifican en esta entrega.

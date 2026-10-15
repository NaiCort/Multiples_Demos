# Validación de V4.2.1

8 de octubre de 2026. Base: `4cf4dc8b50e849aaaa7a23187fb89902b35332dc`. Candidata para revisión de Ian.

| Comprobación | Resultado |
|---|---|
| ESLint | Sin errores |
| Vitest | 40 pruebas aprobadas en 6 archivos |
| Producción | Build completo, con cargas diferidas por giro |
| npm audit | 0 vulnerabilidades conocidas, incluido desarrollo |
| Restaurante | 13 escenarios de navegador aprobados |
| Psicólogo | 16 combinaciones de tema/ancho y 2 recorridos del selector aprobados |
| axe en Restaurante | Sin infracciones automáticas WCAG 2 A/AA, 2.1 A/AA y 2.2 AA en los estados examinados |
| axe en Psicólogo | Sin infracciones automáticas WCAG 2 A/AA y 2.1 A/AA en los estados examinados |
| Actualizador | Aplicación idéntica con LF/CRLF y rechazos sin alterar la copia ante base distinta, cambios locales, repetición o parche modificado |

## Cobertura

- Recorrido completo de comedor en 320 × 740, 390 × 844, 768 × 900, 1024 × 900 y 1440 × 900 con movimiento reducido; 390 × 640 con animaciones y tacto emulado.
- Elección inicial, bloqueo del pedido durante la espera, salto, mesa asignada una vez, imágenes locales, carta, galería, cambios de ingredientes, extras, precio, edición del carrito y cierre.
- Miniatura, regreso al portafolio, recarga y recuperación de la misma mesa. El contador también vuelve desde Psicólogo sin cubrir su selector.
- Minuto automático con reloj de prueba, arrastre con ratón, persistencia de posición, cambio de tamaño y límites del contador.
- Arrastre táctil y deslizamiento de galería con eventos de contacto del navegador, además de controles alternativos por botones.
- Entrega por zona, campo de dirección inválido, tarifa, descuento, pago digital simulado, recarga, avance de pedido, recibo, vista del correo y una visita de fidelidad.
- Búsqueda sin acentos, categorías y preferencia combinadas, resultado vacío, recuperación, reserva futura e invalidación de horario al cambiar el grupo.
- Document Picture-in-Picture: apertura efectiva en Chrome de prueba, contenido y retorno a la visita; rechazo simulado con recuperación visible.
- Almacenamiento bloqueado: aviso visible y recorrido en memoria sin excepción.
- Los recorridos instrumentados no detectaron excepciones JavaScript, fallos de descarga inesperados ni solicitudes POST/PUT/PATCH/DELETE de las simulaciones. Se distinguen las cancelaciones normales al navegar o recargar.

Las pruebas de estado comprueban sanitización de configuraciones, fusión y límite del carrito, precios, ingredientes, clasificación, alérgenos, esperas, fechas límite, recuperación de pedido, caducidad, mesa estable y cierre que suma una visita una sola vez. La reserva futura conserva su disponibilidad por grupo y cierre de lunes.

## Entorno y límites

Node 24.19.0, Linux, Chrome Headless Shell 133.0.6943.16, Playwright 1.63.0 y axe-core 4.13.0. Se probaron builds de producción servidos por Vite preview.

Patio 12 utiliza sus fotos y fuentes locales. Al pasar por la portada o Psicólogo se usaron copias exactas de las respuestas públicas de Google Fonts y Unsplash por las restricciones de red del entorno. Esas pruebas no demuestran la disponibilidad futura de sus proveedores. Sus URLs en el proyecto se conservan.

Las fotografías se comprobaron como archivos WebP decodificables; se conservan su origen y huellas. La revisión visual incluyó teléfono y escritorio. Las comprobaciones de contraste esperan el final de las animaciones de entrada.

No se probaron teléfonos físicos, Safari/iOS, Firefox ni otros sistemas operativos. La ventana de escritorio fue comprobada en el navegador indicado; su compatibilidad en otros dispositivos no se presume. La emulación táctil no sustituye la revisión en tu teléfono. axe no evalúa todos los criterios de accesibilidad ni certifica conformidad completa. No se midió rendimiento en una red móvil real.

Los resultados y una selección de capturas acompañan el ZIP en `evidencias/`, fuera de Git. Las cuentas, pagos, correos, nutrición, mesas y entregas son ejemplos; no se valida un sistema de producción con estas pruebas.

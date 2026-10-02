# Validación de V4.1.3

Revisión: 2 de octubre de 2026. Base: V4.1.2, f08237f26916b619929b3f3b6230caac17032696. Estado: candidata al cierre de Psicólogo, pendiente del visto bueno de Ian.

## Resultados

| Comprobación | Resultado |
|---|---|
| ESLint | Sin errores |
| Vitest | 21 pruebas aprobadas en 5 archivos |
| Compilación de producción | Completada |
| Auditoría npm | 0 vulnerabilidades conocidas en la revisión, incluyendo desarrollo |
| Cuatro estilos × 320, 390, 768 y 1440 px | Sin desbordes horizontales detectados; sala en 4:3 con object-fit: contain |
| axe: WCAG 2 A/AA y 2.1 A/AA | Sin infracciones automáticas en las pantallas y los estados probados |
| Recorridos de 390 y 1440 px | Reserva, WhatsApp, formulario, privacidad, navegación y canales comerciales comprobados |
| Selector táctil y con teclado | Cuatro estilos, persistencia, retirada del oscurecimiento, ayuda y retorno comprobados |
| Actualizador | Aplicación con LF y CRLF; rechaza repetición, cambios locales, rama existente y base diferente |

La matriz y los recorridos se ejecutaron contra el build de producción servido por npm run preview. La reserva comprueba preselección, modalidades por servicio, confirmación y reinicio, además de la invalidación de horario al cambiar de servicio. Se verifican errores asociados y foco en el formulario, Tab y Shift+Tab en el menú, Escape, devolución de foco, navegación por secciones y el carrusel de Minimalista.

Se registran excepciones de JavaScript y solicitudes POST, PUT, PATCH o DELETE durante los recorridos principales. Las simulaciones probadas no realizan esas solicitudes. Los enlaces comerciales se comprueban sin enviar mensajes.

## Entorno y límites

- Node 24.19.0, Linux, Chrome Headless Shell 133.0.6943.16 mediante Playwright 1.63.0 y axe-core 4.13.0.
- Los anchos móviles usan emulación táctil. Esto no sustituye un teléfono real ni verifica Safari/iOS o Firefox.
- La matriz respeta movimiento reducido; los recorridos adicionales del selector mantienen las animaciones activadas.
- El navegador usa copias exactas de las fuentes públicas de Google Fonts y de las dos imágenes de Unsplash por las restricciones de red del entorno. Las URLs de la aplicación se conservan. No se garantiza la disponibilidad futura de esos proveedores.
- Las capturas y los resultados se generan con npm run test:browser y quedan fuera de Git. DEMO_TEST_FIXTURES permite utilizar copias exactas de recursos en un entorno restringido.
- axe no comprueba todos los criterios de accesibilidad. Los resultados no constituyen una certificación completa de conformidad, una auditoría exhaustiva de seguridad ni una medición de rendimiento en una conexión real.

## Revisión pendiente para cerrar

1. Revisar los cuatro estilos en el teléfono y la computadora de Ian: textos, retrato, imagen completa de la sala y proporciones.
2. Recorrer Inicio, Sobre mí, Servicios, Primera cita, Reseñas y Contacto para comprobar la comodidad de los controles fijos.
3. Probar reserva y cambio de servicio, WhatsApp, formulario con ejemplo y privacidad.
4. Cambiar de tema, recargar y volver desde el portafolio.
5. Dar el visto bueno o indicar ajustes concretos antes de V4.2.

La candidata conserva el alcance de demo: sin agenda real, pagos, cuentas, datos clínicos ni transmisión de mensajes.

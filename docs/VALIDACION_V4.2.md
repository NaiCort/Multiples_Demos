# Validación de V4.2.0

Fecha: 5 de octubre de 2026. Base: V4.1.3, d3c393cbc06eac8685f00911b7b3f17f6f606bd8. Primera identidad de Restaurante, pendiente del visto bueno de Ian.

| Comprobación | Resultado |
|---|---|
| ESLint | Sin errores |
| Vitest | 27 pruebas aprobadas en 6 archivos |
| Build de producción | Completado sin avisos de recursos faltantes |
| npm audit | 0 vulnerabilidades conocidas, incluyendo desarrollo |
| Restaurante | 7 escenarios aprobados |
| Regresión de Psicólogo | 16 combinaciones de tema/ancho y 2 recorridos de selector aprobados |
| axe en los estados comprobados | Sin infracciones automáticas de las etiquetas WCAG 2 A/AA y 2.1 A/AA |

## Cobertura de Restaurante

- Anchos 320, 390, 768, 1024 y 1440 px, altura 900 px, con movimiento reducido.
- Escenario adicional de 390 × 640 px con tacto y animaciones activadas. Sin desbordes horizontales detectados; todas las fotografías cargan.
- Navegación móvil, recorrido de Tab/Shift+Tab, Escape, devolución de foco y foco en la sección elegida.
- Categorías, búsqueda sin acentos, resultado vacío y recuperación de carta completa.
- Producto con extras y cantidades, subtotal, recogida/entrega, validación del nombre, cambio de paso, total y confirmación. Quitar el último producto y volver a la carta.
- Reserva: grupo/fecha, horarios no disponibles para seis personas, invalidación de la hora al cambiar de grupo, confirmación y reinicio.
- WhatsApp del restaurante con selección, respuesta y otro mensaje; ubicación ficticia, privacidad, ayuda y canales reales de Ian sin enviar mensajes.
- Entrada desde la portada, carga directa, recarga y regreso. Entrar directamente a Restaurante no descarga PsicologoApp.
- Los recorridos instrumentados no registraron excepciones JavaScript, solicitudes fallidas ni POST/PUT/PATCH/DELETE de las simulaciones.

Las pruebas unitarias cubren precio y normalización de extras, separación de combinaciones, límites de cantidad, costo de entrega, cancelación del temporizador al cerrar y restricciones de reserva.

## Entorno y límites

Node 24.19.0, Linux, Chrome Headless Shell 133.0.6943.16, Playwright 1.63.0 y axe-core 4.13.0. Ambas suites de navegador utilizan el build de producción servido por Vite preview.

Restaurante carga sus propios archivos de imágenes y fuentes. Para la portada y Psicólogo se usaron copias exactas de las respuestas públicas de Google Fonts y Unsplash por las restricciones de red del entorno; sus URLs y funcionamiento en la aplicación no se modificaron. No se afirma disponibilidad futura de esos proveedores.

Los anchos pequeños usan emulación táctil. No se probaron teléfonos físicos, Safari/iOS o Firefox. axe no comprueba todos los criterios de accesibilidad; esto no es una certificación completa ni una auditoría exhaustiva de seguridad. No se midió rendimiento en una conexión móvil real.

Las capturas y los registros de las suites acompañan el ZIP; quedan fuera de Git. La revisión humana de Ian precede a la publicación de esta candidata y a las siguientes identidades de Restaurante. Véase ESTADO_V4.2.md.

# Validación de V4.1.1

Entorno: Node 24.19.0, npm 11.9.0. Herramientas fijadas en package-lock.json.

## Comprobaciones ejecutadas

- `npm run lint`: aprobado.
- `npm test`: 21 pruebas aprobadas en cinco archivos.
- `npm run build`: compilación de producción aprobada.
- `npm audit --omit=dev`: cero vulnerabilidades conocidas reportadas en dependencias de producción en la consulta del 8 de septiembre de 2026.

## Cobertura de regresión

- Cambio de servicio que invalida modalidad y horario.
- Restricción de orientación a modalidad Online.
- Preselección, confirmación, reinicio y regreso a selección de servicio.
- Cancelación del procesamiento al cerrar el diálogo.
- Etiquetas y errores de formulario asociados, foco al primer campo incorrecto.
- Datos ficticios, bloqueo durante envío, ausencia de llamadas a fetch y recuperación de foco.
- Cierre y reapertura rápida de WhatsApp, sin respuestas residuales.
- Nombre de diálogo, evento Escape, foco y limpieza del bloqueo de desplazamiento.
- Contacto, servicios, menú y privacidad en los cuatro temas.
- Recuperación de preferencias inválidas y almacenamiento bloqueado.
- Contraste de los acentos y su texto en controles de diálogo.
- Ruta desconocida, vuelta a la portada e indicador de Inicio.

## Límite de estas comprobaciones

Las pruebas de componentes usan React con JSDOM. El adaptador de diálogo permite comprobar su ciclo de vida, pero JSDOM no implementa el diseño, la capa superior ni la contención nativa del foco de un navegador.

No se ha completado una revisión visual de esta versión en un navegador real desde este entorno. Tampoco se ha publicado esta versión en GitHub o Vercel. Los cambios de espacio, tamaños y adaptación necesitan la comprobación visual final en el navegador del usuario.

## Revisión manual antes de publicar

Ejecuta `npm run dev` y revisa cada tema:

1. Anchos de 320, 390, 768, 1024 y 1440 px: navegación, imágenes, selector y pie de página.
2. Menú móvil: enlaces, desplazamiento interno, cierre y regreso al contenido.
3. Modales: Tab y Mayús+Tab permanecen dentro, Escape cierra y el foco vuelve al control de origen.
4. Reserva: Individual → Presencial → horario → Cambiar servicio → Orientación; no debe conservarse una selección presencial.
5. Formulario: errores, relleno de ejemplo, confirmación, reinicio y nuevo envío.
6. WhatsApp: cerrar durante el procesamiento y abrir de nuevo.
7. Preferencia de movimiento reducido del sistema y ampliación de texto.
8. Recarga directa de /psicologo, regreso a Inicio y ruta inexistente.
9. Carga de fotografías y fuentes con una conexión habitual.

Esta lista comprueba lo que las pruebas automatizadas no pueden afirmar; no representa una certificación completa de accesibilidad.

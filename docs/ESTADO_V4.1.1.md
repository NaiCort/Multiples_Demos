# Estado de la entrega V4.1.1

Fecha: 8 de septiembre de 2026.

## Base y alcance

Esta entrega continúa la V4.1 del ZIP compartido, contrastada con el historial de Git. El 8 de septiembre se volvió a comprobar que `main` en GitHub apuntaba a `a39c869b4cbaff136aee282f434eae53a8818144`.

Las correcciones están descritas en [CHANGELOG.md](../CHANGELOG.md). Las cuatro variantes del psicólogo permanecen separadas visualmente. Los demás giros no se implementaron.

La portada conserva su composición, identidad, textos principales y función de directorio. Solo recibe correcciones de lectura, movimiento reducido, foco, región principal y metadatos.

## Decisiones que actualizan la documentación anterior

| Tema | Estado en V4.1.1 |
|---|---|
| Guía tras 1.8 segundos | Se sustituye por ayuda a petición desde “Cómo funciona” |
| Diálogos superpuestos con z-index | Se emplea la capa superior nativa de `dialog.showModal()`, independiente de esos índices |
| Selección de tema | Se conserva la preferencia, con validación y tolerancia al almacenamiento bloqueado |
| Servicios de la reserva | Reglas explícitas por ID y modalidades; no se deducen de textos |
| Formulario | Datos ficticios de contacto, con ejemplo precargable y sin transmisión |
| Perfil y reseñas | Se identifica su carácter ficticio junto a las secciones |
| Métricas promocionales | Se sustituyen por información de los servicios |
| Caso de estudio | Se retira el enlace incorrecto; el caso real sigue pendiente |
| Metadatos | Título y descripción cambian por ruta en el navegador; no hay prerenderizado |

Los archivos Word compartidos se mantienen como antecedentes. Este documento y el CHANGELOG registran los cambios de esta entrega; no se han reescrito ni actualizado los originales de Word.

## Trabajo reservado para después

1. Completar las demos de restaurante, café, gimnasio, taller, despacho contable y revista.
2. Realizar la revisión visual final de las demos en dispositivos reales.
3. Reemplazar la portada temporal por la página profesional del negocio o del programador independiente.
4. Diseñar los paquetes, extras, dependencias de opciones, precios y estimaciones de producción antes de programar el configurador.
5. Construir el CV virtual en su propio dominio.
6. Preparar casos de estudio reales y materiales propios para sustituir ejemplos y fotografías de referencia.
7. Revisar prerenderizado, tarjetas sociales e indexación cuando se defina la web comercial.

## Al adaptar una demo a un negocio

Los botones simulados deberán conectarse a servicios reales expresamente incluidos en el alcance. La publicación de esta demo no activa formularios, reservas, WhatsApp Business, CRM ni automatizaciones. También deberán sustituirse el perfil, credenciales, reseñas y fotografías por contenido autorizado del cliente.

# Multiples_Demos · V4.1.2

Portafolio de demos interactivas de **Ian Habid Aldana Martínez**.

- Repositorio: https://github.com/NaiCort/Multiples_Demos
- Despliegue: https://multiples-demos.vercel.app/
- Base de esta entrega: V4.1.1, construida sobre V4.1 (`a39c869b4cbaff136aee282f434eae53a8818144`).
- Fecha de entrega: 9 de septiembre de 2026.

La portada actual sigue siendo un directorio temporal. La demo de psicología tiene cuatro estilos: Cálido, Minimalista, Clínico y Naturaleza. Los otros seis giros siguen indicados como “Próximamente”.

## Desarrollo

Usa una versión de Node compatible con `package.json`: 22.22.2 o superior de la rama 22; 24.15.0 o superior de la rama 24; o 26+. Esta entrega se verificó con Node 24.19.0. El requisito incluye las herramientas de prueba.

```bash
npm ci
npm run dev
```

Vite indica la dirección local. Para comprobar la versión:

```bash
npm run lint
npm test
npm run build
npm audit
npm run preview
```

## Estructura

| Ruta | Contenido |
|---|---|
| `src/pages/Bienvenida.jsx` | Directorio temporal de demos |
| `src/giros/psicologo/` | Contenedor, cuatro temas y reglas de servicios |
| `src/components/shared/` | Diálogos, formularios y simulaciones compartidos |
| `src/hooks/` | Navegación, formulario, metadatos y foco |
| `src/utils/` | Preferencia de tema y contraste de controles |
| `tests/` | Pruebas de regresión e integración con React y JSDOM |
| `docs/` | Estado, validación y decisiones de la versión |
| `public/` | Favicons y recursos públicos |

## Comportamiento de las demos

Las reservas, los formularios y el WhatsApp del negocio son simulados. El formulario propone datos ficticios; no hay backend, agenda real, pagos ni envío de mensajes.

“Contactar” y “Hablemos” abren los canales reales de Ian. Sus enlaces se centralizan en `src/components/shared/contactInfo.js`.

El tema visual se recuerda en `localStorage` cuando el navegador lo permite. Un valor inválido o el almacenamiento bloqueado no impiden usar la demo.

La guía se abre desde “Cómo funciona”. El selector, el banner y la marca de agua pertenecen a la demo de psicología, no a la portada.

## GitHub y Vercel

Se conserva el despliegue existente y su regla de rutas en `vercel.json`. Si `main` sigue configurada como rama de producción en Vercel, un push a esa rama inicia un despliegue.

El ZIP incluye el código completo en `proyecto/` y una actualización incremental desde V4.1.1. El aplicador admite que V4.1.1 todavía esté preparada para commit, como ocurre después del instalador anterior. Crea la rama `actualizacion/v4.1.2`, conserva los cambios existentes y comprueba el parche antes de aplicarlo. Consulta `LEEME_PRIMERO.md` en la raíz del ZIP para actualizar las dependencias y verificar antes de publicar.

En V4.1.2, la fotografía de la sala mantiene su proporción original 4:3 en los cuatro temas, con ancho adaptable y altura automática. La variante Naturaleza utiliza esquinas suaves y la tarjeta de experiencia de Cálido queda debajo de la fotografía. Véase [Validación de V4.1.2](docs/VALIDACION_V4.1.2.md).

## Alcance pendiente

La nueva web comercial, el configurador de paquetes/precios, el CV en dominio propio y las nuevas demos siguen pendientes. Véase [Estado de V4.1.1](docs/ESTADO_V4.1.1.md).

Los metadatos por ruta se actualizan en el navegador. La aplicación sigue siendo una SPA: esta entrega no incorpora prerenderizado ni tarjetas sociales específicas para cada ruta.

## Fuentes visuales

Las fuentes se cargan desde Google Fonts. Las fotografías de referencia se cargan desde Unsplash:

- Retrato: https://images.unsplash.com/photo-1573496359142-b8d87734a5a2
- Sala de referencia: https://images.unsplash.com/photo-1600210492486-724fe5c67fb0

Las fotos ilustran un personaje y un lugar ficticios; no acreditan que sus modelos sean profesionales de la salud. Al adaptar la demo a un cliente se sustituirán por material autorizado y representativo del negocio.

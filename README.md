# Multiples_Demos · V4.1.3

Portafolio de demos interactivas de **Ian Habid Aldana Martínez**.

- Repositorio: https://github.com/NaiCort/Multiples_Demos
- Despliegue: https://multiples-demos.vercel.app/
- Base: V4.1.2, commit `f08237f26916b619929b3f3b6230caac17032696`.
- Revisión de la candidata: 2 de octubre de 2026.
- Estado: candidata al cierre de Psicólogo, pendiente del visto bueno de Ian. No inicia V4.2.

La portada continúa como directorio temporal. Psicólogo conserva Cálido, Minimalista, Clínico y Naturaleza. Los otros seis giros siguen como “Próximamente”.

## Desarrollo y comprobaciones

Usa Node 22.22.2 o superior de la rama 22; 24.15.0 o superior de la rama 24; o 26+. La entrega se verificó con Node 24.19.0.

```bash
npm ci
npm run dev
```

Abre la dirección que indique Vite y entra en `/psicologo`.

```bash
npm run lint
npm test
npm run build
npm audit
npm run preview
```

### Comprobación opcional en navegador

Con Vite abierto en otra terminal, el script recorre los cuatro estilos en 320, 390, 768 y 1440 px. Comprueba imágenes, desbordes, accesibilidad automática, reservas, formularios, diálogos, navegación, selector y persistencia.

En Windows puedes usar Microsoft Edge instalado:

```bash
DEMO_BROWSER_CHANNEL=msedge npm run test:browser
```

O instalar el navegador de pruebas:

```bash
npx playwright install chromium
npm run test:browser
```

Para comprobar el build servido por npm run preview:

```bash
DEMO_BASE_URL=http://127.0.0.1:4173 DEMO_BROWSER_CHANNEL=msedge npm run test:browser
```

Las evidencias quedan en `test-results/psicologo/`, fuera de Git. El navegador y la conexión a los proveedores de imágenes/fuentes son necesarios. `DEMO_BROWSER_EXECUTABLE` admite otro ejecutable compatible de Chromium. Los límites están en [Validación de V4.1.3](docs/VALIDACION_V4.1.3.md).

## Estructura

| Ruta | Contenido |
|---|---|
| `src/pages/Bienvenida.jsx` | Directorio temporal |
| `src/giros/psicologo/` | Cuatro temas y reglas de servicios |
| `src/components/shared/` | Diálogos, formularios y simulaciones |
| `src/hooks/` | Navegación, formulario, metadatos y foco |
| `src/utils/` | Preferencias de tema y contraste |
| `tests/` | Regresiones con React y JSDOM |
| `scripts/verify-psicologo.mjs` | Recorridos en navegador y capturas |
| `docs/` | Estado y validación |
| `public/` | Favicons y recursos públicos |

## Comportamiento

Las reservas, los formularios y el WhatsApp del negocio son simulados. El formulario permite usar datos ficticios; no hay backend, agenda real, pagos ni envío de mensajes.

“Agendar” abre la reserva. Las acciones que mencionan WhatsApp abren la conversación de demostración. “Contactar” y “Hablemos” muestran los canales reales de Ian, centralizados en `src/components/shared/contactInfo.js`.

El tema se recuerda en `localStorage` cuando el navegador lo permite. Un valor inválido o el almacenamiento bloqueado no impiden usar la demo. La guía se abre desde “Cómo funciona”.

La fotografía de la sala conserva la proporción original 4:3, el encuadre completo y un ancho adaptable. Naturaleza conserva las esquinas suaves aprobadas y la tarjeta de experiencia de Cálido permanece debajo de la fotografía.

## Actualización, GitHub y Vercel

El ZIP incluye el código completo en `proyecto/` y un parche desde V4.1.2. El aplicador exige esa base y un árbol limpio, crea `actualizacion/v4.1.3` y prepara únicamente los archivos de la entrega. No borra archivos ni hace commits o publicaciones. Consulta `LEEME_PRIMERO.md` en la raíz del ZIP.

Se conserva `vercel.json`. Si `main` sigue como rama de producción, un push a esa rama inicia el despliegue. Esta candidata debe revisarse antes de publicarla.

## Alcance pendiente

La web comercial, el configurador de paquetes/precios, el CV en dominio propio y los nuevos giros permanecen pendientes. Véase [Estado de V4.1.3](docs/ESTADO_V4.1.3.md).

Los metadatos cambian en el navegador. La aplicación sigue siendo una SPA, sin prerenderizado ni tarjetas sociales específicas para cada ruta.

## Recursos visuales

Las fuentes se cargan desde Google Fonts. Las fotografías de referencia se cargan desde Unsplash:

- Retrato: https://images.unsplash.com/photo-1573496359142-b8d87734a5a2
- Sala: https://images.unsplash.com/photo-1600210492486-724fe5c67fb0

Ilustran un personaje y un lugar ficticios. Al adaptar la demo a un cliente deberán sustituirse por material autorizado y representativo del negocio.

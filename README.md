# Multiples_Demos · V4.2.0

Portafolio de demos interactivas de **Ian Habid Aldana Martínez**.

- Repositorio: https://github.com/NaiCort/Multiples_Demos
- Despliegue: https://multiples-demos.vercel.app/
- Base de esta entrega: V4.1.3, commit `d3c393cbc06eac8685f00911b7b3f17f6f606bd8`.
- Fecha: 5 de octubre de 2026.
- Psicólogo fue aprobado por Ian el 2 de octubre. V4.2.0 inicia Restaurante con Patio 12 y queda pendiente de revisión.

La portada sigue como directorio temporal. Psicólogo conserva sus cuatro estilos. Restaurante abre una primera identidad completa de restaurante de barrio; fonda, comida rápida, lujo y gestión de empleados siguen pendientes dentro de V4.2. Café, Gimnasio, Taller, Despacho y Revista todavía muestran “Próximamente”.

## Desarrollo

Node 22.22.2+ de la rama 22, 24.15.0+ de la rama 24 o 26+. Esta entrega se comprobó con Node 24.19.0.

```bash
npm ci
npm run dev
```

Abre `/restaurante` o `/psicologo` en la dirección que indique Vite.

```bash
npm run lint
npm test
npm run build
npm audit
npm run preview
```

## Recorridos de Restaurante

- Carta de 12 productos: categorías, búsqueda que ignora acentos, resultado vacío y recuperación.
- Producto: descripción, alérgenos de ejemplo, extras con precio y cantidad. Máximo nueve unidades por combinación.
- Pedido: corregir cantidades, quitar productos, volver a la carta, recogida o entrega simulada, costo explícito y total actualizado.
- Confirmación: 800 ms de procesamiento, recibo y reinicio. Cerrar durante el procesamiento cancela la simulación y conserva el carrito.
- Reserva: seis fechas futuras, lunes cerrado, grupos de una a seis personas y horarios de ejemplo. Cambiar fecha o grupo invalida el horario anterior.
- WhatsApp: selección de mensaje, procesamiento, respuesta ficticia y reinicio.
- Ubicación: esquema y dirección ficticios, sin enlaces que dirijan a negocios ajenos.
- Guía, privacidad y canales reales de Ian separados de las acciones del restaurante.

Los pedidos y reservas viven en memoria; no hay almacenamiento del carrito, backend, pagos, agenda ni mensajes reales. Se pierden al recargar o salir de Restaurante. Las fuentes y fotos de Patio 12 están alojadas con el proyecto; sus nombres de fuente están aislados para no alterar Psicólogo.

Psicólogo conserva su selector y almacenamiento de preferencias, sus recorridos y la imagen completa de la sala en 4:3. La portada y ese giro pueden solicitar Google Fonts y Unsplash.

## Comprobación opcional en navegador

Con Vite abierto en otra terminal y Edge instalado en Windows:

```bash
DEMO_BROWSER_CHANNEL=msedge npm run test:browser:restaurante
DEMO_BROWSER_CHANNEL=msedge npm run test:browser
```

Alternativamente:

```bash
npx playwright install chromium
npm run test:browser:restaurante
npm run test:browser
```

Los scripts admiten `DEMO_BASE_URL` para probar el preview de producción, `DEMO_BROWSER_EXECUTABLE` para un Chromium compatible y `DEMO_TEST_OUTPUT` para elegir el directorio de evidencias. `DEMO_TEST_FIXTURES` admite copias exactas de fuentes y fotografías para comprobar portada/Psicólogo cuando el entorno restringe las conexiones. Los resultados y capturas quedan en `test-results/`, fuera de Git.

Véase [Validación de V4.2](docs/VALIDACION_V4.2.md) para cobertura y límites. No se afirma certificación completa de accesibilidad ni pruebas en teléfonos físicos.

## Estructura

| Ruta | Contenido |
|---|---|
| `src/pages/` | Directorio temporal y página de ruta inexistente |
| `src/giros/psicologo/` | Cuatro temas y datos de servicios |
| `src/giros/restaurante/` | Patio 12, carta, carrito y reserva |
| `src/components/shared/` | Diálogos, banner, WhatsApp y contacto comercial |
| `src/hooks/` | Navegación, metadatos, foco y formularios |
| `public/restaurante/` | Fotografías, fuentes y licencias de Patio 12 |
| `tests/` | Pruebas de estado y recorridos con React/JSDOM |
| `scripts/` | Recorridos reproducibles en navegador |
| `docs/` | Estado, validación y recursos |

## Actualización y publicación

El ZIP contiene la fuente completa en `proyecto/` y un actualizador incremental desde el commit base indicado. Requiere un árbol limpio y crea `actualizacion/v4.2`, sin borrar archivos, cambiar el historial, hacer commits o publicar. Consulta `LEEME_PRIMERO.md` en el ZIP.

Se conserva `vercel.json`. Revisa localmente antes de hacer merge y push a la rama de producción. La portada comercial, el configurador de paquetes y el CV quedan para después de las demos. Los metadatos se actualizan en el navegador; la aplicación sigue como SPA sin tarjetas sociales prerenderizadas por ruta.

Las fotografías son ilustrativas y no representan negocios reales. Los textos, precios, ingredientes y datos deben adaptarse y validarse para un cliente real. [Recursos y licencias](docs/RECURSOS_RESTAURANTE.md).

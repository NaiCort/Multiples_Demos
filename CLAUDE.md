# Multiples_Demos: reglas para Claude

Portafolio de demos interactivas de Ian Habid Aldana Martínez, una por giro de negocio.
La fuente de planificación es el **Documento Maestro** (fuera del repositorio, versión
vigente: V4.2.5 rev.1 del 11/11/2026). Este archivo resume lo que hace falta para trabajar
en el código sin tenerlo a la mano. Si algo aquí contradice una petición de Ian en la
conversación, manda lo que Ian diga y luego se actualiza este archivo.

## Principio rector

"Funcionalidad simulada no significa funcionalidad falsa." Todo control visible responde;
toda simulación declara que lo es; todo flujo pasa por cinco estados (inicial, selección,
procesamiento, resultado, salida); siempre hay un contacto real con Ian separado de las
acciones ficticias del negocio.

## Estado y orden de trabajo

- Se trabaja **una demo a la vez**, en este orden: Psicólogo (cerrada) → Restaurante
  (cerrada en V4.2.5 con **Patio 12**) → **Café (siguiente, V4.3.#)** → Gimnasio (V4.4) →
  Taller mecánico (V4.5) → Despacho contable (V4.6) → Revista digital (V4.7).
- **Restaurante = solo Patio 12.** No se construyen las sub-categorías (fonda, comida
  rápida, lujo) ni el panel de empleados y precios: ambas ideas quedaron descartadas.
- **Café = Ladera**, una sola identidad y un solo local, sin gestión de empleados. Su
  ficha está en `docs/FICHA_CAFE.md`; leerla antes de tocar `src/giros/cafe/`.
- Idea a futuro, sin fecha: una demo de empresa con gestión de empleados.
- **No se modifican demos ya cerradas** mientras se construyen las demás. Mejoras y
  correcciones a demos existentes se anotan en "Pendientes para la fase de ajustes" (abajo)
  y se hacen en V4.8, al terminar las siete. Excepción: un error real en un componente
  compartido que rompa algo se corrige de inmediato.
- Fuera de alcance en todas las demos: backend, cuentas reales, pagos, inventario real.

## Versionado y commits

- Versión `V4.x.#` según la demo que originó el cambio, no según los archivos tocados.
- Mensajes de commit sin acentos ni guion largo, empezando por la versión
  (`V4.3: ...`). Commits pequeños; formato, herramientas y código del sitio van separados.
- Cada entrega actualiza `package.json` (versión), `CHANGELOG.md`, `docs/ESTADO_V*.md`
  y `docs/VALIDACION_V*.md`. Separar siempre: implementado, verificado en pruebas,
  desplegado en producción.
- Flujo: rama → pull request → vista previa de Vercel revisada por Ian en su teléfono →
  merge a `main` → producción.

## Comprobaciones antes de subir

```bash
npm run lint
npm run format:check
npm test
npm run build
```

Las pruebas de navegador (`npm run test:browser:*`) se corren al cerrar una versión.
Chromium y Playwright ya están instalados en el entorno de nube.

## Diseño: Guía de identidad y calidad visual v1.1

Cada demo nueva empieza por su **ficha de identidad** en `docs/` antes de escribir código:
paleta (dominante, acento, neutro con hex y regla del acento), dos tipografías, radios y
sombras, movimiento y su motivo, densidad, 2–3 anclas visuales, patrones prohibidos.
Prohibir no basta: la ficha da una dirección propia.

Regla de conteo: máximo uno o dos patrones vigilados por pantalla. Vigilados: Inter para
todo; morado/índigo; degradados y texto con degradado; brillos, auroras y manchas de luz;
vidrio en todo; etiqueta (eyebrow) sobre el título; serif cursiva como acento en un
título; tres tarjetas iguales con ícono arriba; tarjetas dentro de tarjetas; borde de
color en un lado; pasos 1-2-3 y numeración 01/02/03 decorativa; filas de cifras;
todo centrado; monoespaciada como adorno; verde esmeralda de respaldo; los mismos íconos
de Lucide en cada tarjeta; muro de logos; emojis como íconos; la misma aparición hacia
arriba en todo; Title Case; el glifo ✨.

Reglas de oficio: fuentes e imágenes servidas desde el propio sitio (no Unsplash ni
Google Fonts en tiempo de ejecución); cifras tabulares en precios; un solo h1 y
metadatos propios por ruta; sin `href="#"`; movimiento con ease-out, 200–300 ms, entradas
desde escala 0.95, y fundido cuando se pide movimiento reducido. Pasada final: contar
patrones, temáticar selección, foco, barras de desplazamiento y subrayado, correr
`/impeccable audit` y `web-design-guidelines`, medir Core Web Vitals y probar en móvil.

Herramientas instaladas en `.claude/` (ver `.claude/README.md`): frontend-design,
impeccable, web-design-guidelines y web-quality-skills.

## Café en curso

Publicado en `/cafe`: Inicio (V4.3.0), Carta y pedido para recoger (V4.3.1), Origen y
café en grano (V4.3.2), Prepara en casa (V4.3.3). La Bienvenida se habilita para Café solo al cerrar V4.3.4.
Pendiente: fotografías de la carta (requieren clave de la API de Unsplash o permitir
Wikimedia Commons). Siguiente: V4.3.4, Visítanos con cata, pasada final y alta en la Bienvenida.

## Pendientes para la fase de ajustes (V4.8)

No tocar antes de terminar las siete demos.

1. **FloatingTimer / RestaurantProvider:** conservar el estado guardado, pero mostrar el
   contador solo dentro de `/restaurante/*` (decidido el 12/11/2026).
2. **Bienvenida:** bajar de 5–6 patrones a 2 como máximo (etiqueta sobre el título,
   "*Ian*" en serif cursiva, numeración 01–06, manchas de luz, monoespaciada decorativa).
   Actualizar después la publicación de LinkedIn. Pasar el catálogo de giros a un archivo
   de datos con estados (Disponible, En desarrollo, Próximamente, En mantenimiento).
3. **Psicólogo:** servir sus fotos desde el sitio en vez de images.unsplash.com, por
   etapas y no todo a la vez; revisar Inter en el tema Cálido; auditoría de los cuatro
   temas (unas 700 líneas cada uno) para consolidar componentes duplicados.
4. **Patio 12:** quitar la etiqueta en mayúsculas sobre el título en Inicio y Carta.
5. Fichas de identidad a posteriori de los cuatro temas de Psicólogo y de Patio 12.
6. **Componentes compartidos:** la llamada comercial (`ComercialCTA`) lleva una etiqueta
   en mayúsculas sobre el título y una tarjeta centrada; el banner de demo genera la alerta
   `region` de axe (buenas prácticas). Revisar ambos para todas las demos.
7. Dependencias de desarrollo con avisos moderados de `npm audit` (vitest, minimatch vía
   eslint): actualizar cuando haya versión compatible.

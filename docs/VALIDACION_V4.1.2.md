# Validación de V4.1.2

Fecha: 9 de septiembre de 2026. Entorno: Node 24.19.0 y npm 11.9.0.

## Corrección del encuadre

Las capturas de V4.1.1 mostraban la fotografía de la sala dentro de marcos demasiado altos en móvil. Los temas fijaban su altura entre 420 y 480 píxeles y usaban `object-cover`; el ancho disminuía, pero la altura permanecía.

La imagen servida por la URL actual mide 600 × 450 píxeles, con proporción 4:3. Los cuatro temas ahora usan esa proporción, ancho del 100%, altura automática y `object-fit: contain`. También declaran las dimensiones originales en HTML para reservar el espacio durante la carga. Por ejemplo, a 300 píxeles de ancho le corresponden 225 de alto.

Naturaleza sustituye la máscara ovalada de esta foto por esquinas redondeadas. La tarjeta de experiencia de Cálido pasa debajo de la imagen y deja de cubrirla. Se conservan los filtros y el resto de los estilos de cada tema.

## Comprobaciones ejecutadas

- `npm ci`: instalación reproducible aprobada.
- `npm run lint`: aprobado.
- `npm test`: 21 pruebas aprobadas en cinco archivos.
- `npm run build`: compilación de producción aprobada.
- `npm audit`: cero vulnerabilidades conocidas reportadas, incluyendo las dependencias de desarrollo.
- Revisión del cambio: únicamente los cuatro temas, la regla compartida de la imagen, la versión, el archivo de dependencias y la documentación.

El archivo de dependencias del proyecto completo incluye Browserslist 4.28.9 y baseline-browser-mapping 2.11.21. El parche incremental cambia solo la versión del proyecto dentro de ese archivo, por lo que admite tanto el archivo original de V4.1.1 como el que ya recibió la actualización de seguridad. Los comandos de aplicación completan la actualización de esas dependencias en la copia local.

## Comprobación visual pendiente

Las capturas recibidas corresponden al problema anterior. No se ha completado una revisión de V4.1.2 en un navegador real desde este entorno; las pruebas con JSDOM no calculan el diseño de la página.

Antes de publicar, revisar la sección “Sobre mí” en Cálido, Minimalista, Clínico y Naturaleza a anchos de 320, 390, 768 y 1440 píxeles. La fotografía debe conservar el mismo encuadre horizontal 4:3, mostrar ambos lados de la sala y reducir su altura junto con el ancho. En Cálido, comprobar que la tarjeta queda debajo de la imagen. En Naturaleza, comprobar que el encuadre deja de ser ovalado.

El alcance y las comprobaciones funcionales de [V4.1.1](VALIDACION_V4.1.1.md) se mantienen como antecedente de esta entrega.

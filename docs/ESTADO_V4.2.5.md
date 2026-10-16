# V4.2.5 · carta ampliada y directorio internacional

Base publicada por Ian: V4.2.4, `0f84a9d6fb0d999255488129152f3bdf52ca5d43`. Candidata del 16 de octubre de 2026, pendiente de revisión y publicación por Ian.

## Cambios

- Carta con columna izquierda de categorías en escritorio y selector compacto en móvil/tableta. Resultados agrupados, fotografías con marcos estables, búsqueda, preferencias y número de opciones. Se mantienen las galerías y personalizaciones anteriores.
- 43 productos definidos: 27 comunes y 16 regionales. Cada local presenta 28 opciones. Los doce productos anteriores conservan identificadores, precios y configuraciones.
- Desayunos, antojos, entradas, platos fuertes, carnes y parrilla, ensaladas, especialidades de la casa, sabores de la región, postres, bebidas y vinos/cervezas/cocteles.
- Una propuesta regional distinta para cada local. Se mantienen categorías, búsqueda y preferencias al cambiar de local; pueden producir resultados vacíos que se pueden recuperar. El parámetro antiguo `categoria=Platos` sigue funcionando como «Platos fuertes».
- Directorio con países y estados a la izquierda en escritorio; selectores de país/estado en pantallas pequeñas. El filtro lleva a la lista agrupada debajo del mapa y se comparte en la URL mediante `pais`, `estado` y `ciudad`. La navegación atrás/adelante y la recarga conservan los filtros válidos.
- 16 locales: 12 en México y cuatro en Estados Unidos. Nuevos estados mexicanos: Oaxaca, Chiapas, Querétaro y Guanajuato. Texas: Austin y San Antonio. California: Los Angeles y San Francisco. Todos toman como referencia parques o plazas reales, sin afirmar que exista un restaurante en ellos.
- El mapa carga bajo petición y usa los mismos filtros que las fichas. Se conservan la selección de marcador, agrupación, lista manual y geolocalización opcional. Explorar una zona o ficha no cambia el local del pedido.
- Cambiar el local conserva el carrito. Si contiene una especialidad de otro local, se explica cómo quitarla o volver al local correspondiente; no se permite confirmar hasta resolverlo. La regla también se comprueba en el estado, incluso si se cambia el local en el último paso del pedido. Un pedido ya confirmado mantiene su local y su receta al recargar.
- Fotografías adicionales locales con procedencia, licencia individual, autor y huella; créditos accesibles desde el pie de página. Reducción proporcional y conversión a WebP sin recortar ni retocar su contenido.

## Revisar antes de publicar

1. Carta: columna izquierda, desayuno, ensaladas, bebidas y especialidades. Combinar búsqueda y preferencia; recuperar un resultado vacío. Comprobar en escritorio y teléfono real.
2. Cambiar de CDMX–Chapultepec a Oaxaca y después a Austin: observar que cambia «Sabores de la región» y se conservan los platos comunes.
3. Llevar una especialidad en el carrito y cambiar de local. Ver el aviso, resolverlo quitando el plato o regresando al local, confirmar y recargar el recibo.
4. Locales: México/Estados Unidos, Texas/California, filtros de ciudad y vuelta a todos. Revisar que la lista esté debajo del mapa y que la selección del pedido no cambie al explorar.
5. Abrir el mapa de cada estado estadounidense, las fichas, reservas y un QR de mesa. Comprobar que contador, visita y local sigan siendo los mismos al navegar.

## Alcance conservado

Moneda de ejemplo: **MXN en todos los locales**, sin conversión ni cobros. No se incorpora inventario por local, servidor, cuentas reales, administración, reparto o facturación real. Los ingredientes, nutrientes, alérgenos y recetas siguen siendo ficticios. Los nombres regionales expresan inspiración culinaria; no certifican autenticidad ni una receta tradicional.

La portada temporal, Psicólogo y los giros pendientes mantienen su planificación previa. Esta entrega amplía Patio 12; no declara terminadas otras identidades del restaurante.

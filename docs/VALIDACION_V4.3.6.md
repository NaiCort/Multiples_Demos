# Validación de V4.3.6

Entorno: Node 22, Chromium de Playwright; vista previa de producción. 14 de noviembre de 2026. El visto bueno de Ian en sus dispositivos sigue pendiente.

## Comprobaciones

- ESLint, Prettier y compilación sin errores.
- **116 pruebas en diecisiete archivos.** Se añaden cinco en `tests/cafe-cierre.test.jsx`: tamaño en ml o g en toda la carta, alérgenos según la leche, alérgenos e IVA visibles en la carta, aviso de privacidad con borrado de datos, y «Cómo llegar» sin enlaces a mapas reales. La prueba de la carta encontró un error antes de publicar: el campo de alérgenos del espresso había quedado en la categoría del mismo nombre; se corrigió.
- **Navegador (`npm run test:browser:cafe`):** cinco escenarios de 320 a 1440 px; ahora abren «Abrir en mapas» y el aviso de privacidad, con axe y comprobación de desbordamiento. **5 de 5 aprobados**, sin infracciones WCAG.
- Revisión visual en 390 px de la carta con alérgenos, «Cómo llegar» y el aviso de privacidad.
- Sin cambios de diseño ni de peso relevante; las mediciones de Core Web Vitals de V4.3.5 siguen vigentes.

## No comprobado

Teléfono físico, Safari y lector de pantalla real: revisión de Ian en la vista previa.

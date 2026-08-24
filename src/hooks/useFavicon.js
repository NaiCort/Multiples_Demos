import { useEffect } from "react"

// Cambia el ícono de la pestaña del navegador según el giro activo (Fase 3 del
// Documento Maestro: cada demo tiene su propio símbolo, mismo molde oscuro/dorado,
// distinto solo en el glifo). Como la aplicación es de una sola página, cambiar de
// ruta no recarga el HTML — por eso el ícono se actualiza aquí, no en index.html.
// Cada punto de entrada (Bienvenida, PsicologoApp, y cada giro futuro) debe llamar
// a este hook con su propio ícono, incluyendo Bienvenida — de lo contrario el
// ícono de la última demo visitada se queda pegado al volver al directorio.

export default function useFavicon(href) {
  useEffect(() => {
    let link = document.querySelector("link[rel='icon']")
    if (!link) {
      link = document.createElement("link")
      link.rel = "icon"
      document.head.appendChild(link)
    }
    link.href = href
  }, [href])
}

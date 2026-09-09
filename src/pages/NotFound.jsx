import useRouteFocus from "../hooks/useRouteFocus"
import { Link } from "react-router-dom"
import useFavicon from "../hooks/useFavicon"
import usePageMetadata from "../hooks/usePageMetadata"

export default function NotFound() {
  useRouteFocus()
  useFavicon("/favicon.svg")
  usePageMetadata("Página no encontrada · Ian Aldana Martínez", "Regresa al portafolio para consultar las demos disponibles.")
  return <main className="route-message" id="contenido" tabIndex={-1}>
    <p className="text-sm">404</p>
    <h1 className="text-3xl">Esta página no existe</h1>
    <p>Puedes seguir explorando las demos disponibles.</p>
    <Link to="/">Volver al portafolio</Link>
  </main>
}

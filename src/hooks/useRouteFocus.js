import { useEffect } from "react"

// Se ejecuta al entrar a una página, no al cambiar de tema.
export default function useRouteFocus() {
  useEffect(() => {
    document.getElementById("contenido")?.focus({ preventScroll: true })
    if (window.location.hash) {
      try {
        const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)))
        target?.scrollIntoView({ behavior: "instant" })
      } catch { /* Un fragmento mal formado no debe impedir explorar la página. */ }
    }
  }, [])
}

import { useEffect, useRef, useState, useSyncExternalStore } from "react"

const IDS = ["inicio", "sobre-mi", "servicios", "primera-cita", "contacto"]
function readNavigation() {
  let active = "inicio"
  const navbar = document.querySelector('nav[aria-label="Navegación de la demo"]')
  const threshold = Math.max(160, (navbar?.getBoundingClientRect().bottom || 0) + 24)
  for (const id of IDS) {
    const section = document.getElementById(id)
    if (section && section.getBoundingClientRect().top <= threshold) active = id
  }
  return `${window.scrollY > 40}:${active}`
}
function subscribe(callback) {
  let frame
  const update = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(callback) }
  window.addEventListener("scroll", update, { passive: true })
  window.addEventListener("resize", update)
  return () => {
    cancelAnimationFrame(frame)
    window.removeEventListener("scroll", update)
    window.removeEventListener("resize", update)
  }
}
export default function useDemoNavigation() {
  const snapshot = useSyncExternalStore(subscribe, readNavigation, () => "false:inicio")
  const [menuOpen, setMenuOpen] = useState(false)
  const navigationFrame = useRef(null)
  useEffect(() => () => cancelAnimationFrame(navigationFrame.current), [])
  const navigateToSection = event => {
    const target = document.getElementById(event.currentTarget.hash.slice(1))
    setMenuOpen(false)
    if (!target) return
    cancelAnimationFrame(navigationFrame.current)
    // Tras cerrar el diálogo, el teclado continúa desde la sección elegida.
    navigationFrame.current = requestAnimationFrame(() => {
      if (!target.isConnected) return
      target.scrollIntoView({ block: "start" })
      const heading = target.querySelector("h1, h2") || target
      heading.tabIndex = -1
      heading.focus({ preventScroll: true })
    })
  }
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1280px)")
    const closeOnDesktop = event => { if (event.matches) setMenuOpen(false) }
    desktop.addEventListener("change", closeOnDesktop)
    return () => desktop.removeEventListener("change", closeOnDesktop)
  }, [])
  const [scrolled, activeSection] = snapshot.split(":")
  return { scrolled: scrolled === "true", activeSection, menuOpen, setMenuOpen, navigateToSection }
}

import { useEffect, useState, useSyncExternalStore } from "react"

const IDS = ["inicio", "sobre-mi", "servicios", "primera-cita", "contacto"]
function readNavigation() {
  let active = "inicio"
  for (const id of IDS) {
    const section = document.getElementById(id)
    if (section && section.getBoundingClientRect().top <= 160) active = id
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
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1280px)")
    const closeOnDesktop = event => { if (event.matches) setMenuOpen(false) }
    desktop.addEventListener("change", closeOnDesktop)
    return () => desktop.removeEventListener("change", closeOnDesktop)
  }, [])
  const [scrolled, activeSection] = snapshot.split(":")
  return { scrolled: scrolled === "true", activeSection, menuOpen, setMenuOpen }
}

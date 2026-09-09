import useRouteFocus from "../../hooks/useRouteFocus"
import { useState, useEffect } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import ThemeCalido from "./themes/ThemeCalido"
import ThemeMinimalista from "./themes/ThemeMinimalista"
import ThemeClinico from "./themes/ThemeClinico"
import ThemeNaturaleza from "./themes/ThemeNaturaleza"
import ThemeSwitcher from "../../components/ThemeSwitcher"
import WaterMark from "../../components/WaterMark"
import DemoBanner from "../../components/shared/DemoBanner"
import useFavicon from "../../hooks/useFavicon"
import usePageMetadata from "../../hooks/usePageMetadata"
import { readTheme, saveTheme, THEME_NAMES } from "../../utils/themeStorage"

const themes = { calido: ThemeCalido, minimalista: ThemeMinimalista, clinico: ThemeClinico, naturaleza: ThemeNaturaleza }

export default function PsicologoApp() {
  useRouteFocus()
  useFavicon("/favicons/psicologo.svg")
  usePageMetadata("Demo de psicología · Ian Aldana Martínez", "Explora cuatro estilos de un consultorio ficticio y prueba sus reservas, formularios y conversación simulada.")
  const [activeTheme, setActiveTheme] = useState(readTheme)
  const reduced = useReducedMotion()
  useEffect(() => { saveTheme(activeTheme) }, [activeTheme])
  const ActiveTheme = themes[activeTheme] || ThemeCalido

  return <div className="relative min-h-screen">
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <DemoBanner />
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={activeTheme} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: reduced ? 0 : 0.2 }}>
        <ActiveTheme />
      </motion.div>
    </AnimatePresence>
    <ThemeSwitcher activeTheme={activeTheme} onThemeChange={theme => { if (THEME_NAMES.includes(theme)) setActiveTheme(theme) }} />
    <WaterMark />
  </div>
}

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import ThemeCalido from "./themes/ThemeCalido"
import ThemeMinimalista from "./themes/ThemeMinimalista"
import ThemeClinico from "./themes/ThemeClinico"
import ThemeNaturaleza from "./themes/ThemeNaturaleza"
import ThemeSwitcher from "./components/ThemeSwitcher"
import WaterMark from "./components/WaterMark"
import DemoBanner from "./components/shared/DemoBanner"
import useFavicon from "./hooks/useFavicon"

// Contenedor de la demo de Psicólogo (Fase 3 del Documento Maestro: vive en su
// propia ruta /psicologo, separado de la pantalla de bienvenida). Toda la lógica
// de manejo de tema, transición y los elementos flotantes propios de una demo
// (ThemeSwitcher, WaterMark, DemoBanner) viven aquí — nunca en Bienvenida.jsx.

const themes = {
  calido: ThemeCalido,
  minimalista: ThemeMinimalista,
  clinico: ThemeClinico,
  naturaleza: ThemeNaturaleza,
}

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
}

export default function PsicologoApp() {
  useFavicon("/favicons/psicologo.svg")
  const [activeTheme, setActiveTheme] = useState(() => {
    return localStorage.getItem("demo-psicologo-theme") || "calido"
  })
  const [switcherReady, setSwitcherReady] = useState(false)

  useEffect(() => {
    localStorage.setItem("demo-psicologo-theme", activeTheme)
  }, [activeTheme])

  useEffect(() => {
    const timer = setTimeout(() => setSwitcherReady(true), 1200)
    return () => clearTimeout(timer)
  }, [])

  const ActiveTheme = themes[activeTheme]

  return (
    <div className="relative min-h-screen">
      <DemoBanner />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTheme}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <ActiveTheme />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {switcherReady && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ThemeSwitcher
              activeTheme={activeTheme}
              onThemeChange={setActiveTheme}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <WaterMark />
    </div>
  )
}

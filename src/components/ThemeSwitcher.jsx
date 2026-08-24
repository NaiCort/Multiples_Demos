import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const themeConfig = {
  calido: {
    label: "Cálido",
    color: "#6B8F71",
    textColor: "text-white",
  },
  minimalista: {
    label: "Minimalista",
    color: "#1A1A1A",
    textColor: "text-white",
  },
  clinico: {
    label: "Clínico",
    color: "#2C4A7C",
    textColor: "text-white",
  },
  naturaleza: {
    label: "Naturaleza",
    color: "#7A9E7E",
    textColor: "text-white",
  },
}

export default function ThemeSwitcher({ activeTheme, onThemeChange }) {
  const [isHovering, setIsHovering] = useState(false)
  const [hoveredTheme, setHoveredTheme] = useState(null)

  return (
    <>
      {/* Overlay de niebla — debe cubrir absolutamente todo lo demás (banner, navbar, marca de agua) */}
      <AnimatePresence>
        {isHovering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[70] pointer-events-none"
            style={{
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(4px)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Switcher — el único elemento que debe quedar por encima de la niebla */}
      <div
        className="fixed bottom-6 right-6 z-[80] flex flex-col items-end gap-2"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false)
          setHoveredTheme(null)
        }}
      >
        {/* Etiqueta del tema hovereado o activo */}
        <AnimatePresence mode="wait">
          {(hoveredTheme || isHovering) && (
            <motion.span
              key={hoveredTheme || activeTheme}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              className="text-white text-xs font-medium bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm"
            >
              {themeConfig[hoveredTheme || activeTheme].label}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Círculos de temas */}
        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-2 rounded-full">
          {Object.entries(themeConfig).map(([key, config]) => {
            const isActive = activeTheme === key
            const isHovered = hoveredTheme === key

            return (
              <motion.button
                key={key}
                onClick={() => onThemeChange(key)}
                onMouseEnter={() => setHoveredTheme(key)}
                onMouseLeave={() => setHoveredTheme(null)}
                animate={{
                  width: isActive ? 28 : 16,
                  height: isActive ? 28 : 16,
                  scale: isHovered && !isActive ? 1.15 : 1,
                }}
                transition={{ duration: 0.2 }}
                className="rounded-full border-2 border-white/40 cursor-pointer"
                style={{ backgroundColor: config.color }}
                title={config.label}
              />
            )
          })}
        </div>
      </div>
    </>
  )
}
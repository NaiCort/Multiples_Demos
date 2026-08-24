import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Palette, MousePointerClick, CalendarCheck } from "lucide-react"

// Guía de exploración inicial (Parte III, Fase 2 del Documento Maestro, marcada como
// opcional): sugiere las tres acciones clave de la demo la primera vez que alguien
// llega, sin bloquear nada. Se recuerda vía localStorage para no repetirse en visitas
// posteriores ni al cambiar de tema dentro de la misma demo.

const STORAGE_KEY = "demo-onboarding-seen"

const TIPS = [
  { icon: Palette, text: "Cambia el estilo con el selector de la esquina" },
  { icon: MousePointerClick, text: "Elige un servicio para ver cómo se sentiría reservarlo" },
  { icon: CalendarCheck, text: "Simula una reserva completa, sin compromiso" },
]

export default function OnboardingGuide({
  accentColor,
  accentTextColor = "#ffffff",
  fontFamily,
  headingFontFamily,
  radius = 14,
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return
    const timer = setTimeout(() => setVisible(true), 1800)
    return () => clearTimeout(timer)
  }, [])

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true")
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-label="Guía de exploración de la demo"
          className="fixed z-[45] bottom-20 left-4 right-4 sm:left-6 sm:right-auto sm:w-80 p-5"
          style={{ backgroundColor: "#16181D", border: "1px solid rgba(255,255,255,0.1)", borderRadius: radius, boxShadow: "0 16px 48px rgba(0,0,0,0.4)" }}
        >
          <div className="flex items-start justify-between mb-3">
            <h4 style={{ fontFamily: headingFontFamily || fontFamily, color: "#fff", fontSize: 15 }}>
              Tres cosas que puedes probar
            </h4>
            <button onClick={dismiss} aria-label="Cerrar guía" className="p-1 -mt-1 -mr-1 rounded-full hover:bg-white/10 shrink-0">
              <X size={16} color="rgba(255,255,255,0.5)" />
            </button>
          </div>

          <div className="space-y-3 mb-4">
            {TIPS.map((tip, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${accentColor}20` }}>
                  <tip.icon size={14} style={{ color: accentColor }} />
                </div>
                <p style={{ fontFamily, color: "rgba(255,255,255,0.75)", fontSize: 13, lineHeight: 1.4 }}>
                  {tip.text}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={dismiss}
            className="w-full py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: accentColor, color: accentTextColor, fontFamily, borderRadius: radius > 20 ? 999 : radius }}
          >
            Entendido, ¡vamos!
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

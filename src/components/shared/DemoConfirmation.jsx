import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

// Panel de confirmación reutilizable para flujos simulados (Parte IV, sección 11:
// estados "resultado" y "salida"). Cada tema lo parametriza con sus propios
// colores y tipografía para mantener la identidad visual sin duplicar la lógica.
//
// Copy base tomado de Parte IV, sección 13 del Documento Maestro.

export default function DemoConfirmation({
  message = "Demostración completada. En un sitio real, este mensaje se enviaría de forma segura al negocio. En esta demo no se almacenaron ni transmitieron datos.",
  onReset,
  onClose,
  accentColor,
  accentTextColor = "#ffffff",
  mutedColor = "rgba(255,255,255,0.5)",
  borderColor = "rgba(255,255,255,0.15)",
  fontFamily,
  radius = 8,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      role="status"
      className="p-6 text-center"
      style={{
        backgroundColor: "rgba(255,255,255,0.06)",
        border: `1px solid ${borderColor}`,
        borderRadius: radius,
      }}
    >
      <CheckCircle2 size={28} style={{ color: accentColor, margin: "0 auto 12px" }} />
      <p style={{ fontFamily, color: "#ffffff", fontSize: 14, lineHeight: 1.7 }}>
        {message}
      </p>
      <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
        <button
          type="button"
          onClick={() => onReset?.()}
          className="px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: accentColor, color: accentTextColor, fontFamily, borderRadius: radius }}
        >
          Reiniciar demo
        </button>
        <button
          type="button"
          onClick={() => onClose?.()}
          className="px-5 py-2.5 text-sm transition-opacity hover:opacity-70"
          style={{ color: mutedColor, fontFamily }}
        >
          Cerrar
        </button>
      </div>
    </motion.div>
  )
}

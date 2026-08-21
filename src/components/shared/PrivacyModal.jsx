import { motion, AnimatePresence } from "framer-motion"
import { X, ShieldCheck } from "lucide-react"

// Modal breve de privacidad (Fase 1: "interacción demostrativa mínima, no documento
// jurídico completo"). Vive en components/shared/ porque resuelve un patrón de
// interacción reutilizable entre giros, parametrizado por color y tipografía.

export default function PrivacyModal({ isOpen, onClose, accentColor, accentTextColor = "#1A1208", fontFamily, radius = 16 }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70]"
            style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="privacy-modal-title"
            className="fixed z-[71] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-w-md p-6"
            style={{ backgroundColor: "#1A1C22", border: "1px solid rgba(255,255,255,0.1)", borderRadius: radius }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} color={accentColor} />
                <h3 id="privacy-modal-title" className="text-white font-medium" style={{ fontFamily }}>
                  Aviso de privacidad
                </h3>
              </div>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 transition-colors" aria-label="Cerrar">
                <X size={18} color="rgba(255,255,255,0.6)" />
              </button>
            </div>

            <p className="text-sm leading-relaxed mb-3" style={{ color: "rgba(255,255,255,0.75)", fontFamily }}>
              Esta demostración no recopila, almacena ni comparte ningún dato real. Lo que escribas
              en los formularios de este sitio permanece únicamente en tu navegador durante esta
              visita, nunca se envía a ningún servidor, y desaparece al cerrar o recargar la página.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)", fontFamily }}>
              En un sitio real, aquí iría el aviso de privacidad completo del negocio: qué datos se
              recopilan, con qué fin, y los derechos del usuario sobre ellos.
            </p>

            <button
              onClick={onClose}
              className="w-full mt-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
              style={{ backgroundColor: accentColor, color: accentTextColor, fontFamily, borderRadius: radius > 8 ? 999 : radius }}
            >
              Entendido
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

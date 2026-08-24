import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check, CheckCheck, ArrowLeft } from "lucide-react"

// Vista previa de WhatsApp simulada (Parte III, Fase 2 del Documento Maestro):
// reemplaza el enlace directo a un número ficticio por una simulación de
// conversación real, siguiendo el modelo de 5 estados (Parte IV, sección 11).
// Copy base tomado de Parte IV, sección 13 ("Vista previa de WhatsApp").

const DEFAULT_MESSAGES = [
  "Hola, me gustaría agendar una primera cita",
  "Hola, tengo algunas dudas antes de agendar",
  "Hola, ¿tienen disponibilidad esta semana?",
]

export default function WhatsAppPreview({
  isOpen,
  onClose,
  businessName = "Dra. Valeria Romero",
  autoReply = "¡Hola! Gracias por escribir. Te responderé lo antes posible para coordinar los detalles.",
  messages = DEFAULT_MESSAGES,
  accentColor = "#25D366",
  fontFamily,
  radius = 16,
}) {
  const [step, setStep] = useState("selection") // selection | processing | result
  const [chosenMessage, setChosenMessage] = useState(null)

  const handleChoose = (msg) => {
    setChosenMessage(msg)
    setStep("processing")
    setTimeout(() => setStep("result"), 750)
  }

  const handleReset = () => {
    setStep("selection")
    setChosenMessage(null)
  }

  const handleClose = () => {
    onClose?.()
    setTimeout(handleReset, 300)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[90]"
            style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            className="fixed z-[91] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-w-sm overflow-hidden"
            style={{ borderRadius: radius, boxShadow: "0 24px 60px rgba(0,0,0,0.4)" }}
          >
            {/* Encabezado tipo WhatsApp */}
            <div className="flex items-center gap-3 px-4 py-3" style={{ backgroundColor: "#075E54" }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold"
                style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#fff", fontFamily }}>
                {businessName.split(" ").map(w => w[0]).slice(0, 2).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate" style={{ fontFamily }}>{businessName}</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.7)", fontFamily }}>
                  {step === "result" ? "en línea" : "simulación de contacto"}
                </p>
              </div>
              <button onClick={handleClose} aria-label="Cerrar" className="p-1 rounded-full hover:bg-white/10">
                <X size={18} color="#fff" />
              </button>
            </div>

            {/* Cuerpo tipo chat */}
            <div className="p-4 min-h-[220px] flex flex-col justify-end gap-2"
              style={{ backgroundColor: "#ECE5DD", backgroundImage: "radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)", backgroundSize: "16px 16px" }}>

              {step === "selection" && (
                <div>
                  <p className="text-xs text-center mb-3 px-4 py-1.5 rounded-full inline-block mx-auto"
                    style={{ backgroundColor: "rgba(0,0,0,0.06)", color: "#54656F", fontFamily, display: "block", width: "fit-content", margin: "0 auto 14px" }}>
                    Esta es una simulación del contacto
                  </p>
                  <p className="text-xs mb-2 text-center" style={{ color: "#54656F", fontFamily }}>
                    Elige qué mensaje enviarías:
                  </p>
                  <div className="space-y-2">
                    {messages.map((msg, i) => (
                      <button
                        key={i}
                        onClick={() => handleChoose(msg)}
                        className="w-full text-left px-3.5 py-2.5 text-sm transition-transform hover:scale-[1.02]"
                        style={{ backgroundColor: "#fff", borderRadius: 10, fontFamily, color: "#111B21", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}
                      >
                        {msg}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === "processing" && (
                <div className="flex items-center justify-center py-10">
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="text-sm"
                    style={{ color: "#54656F", fontFamily }}
                  >
                    Enviando…
                  </motion.div>
                </div>
              )}

              {step === "result" && (
                <div className="space-y-2">
                  <motion.div
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="ml-auto max-w-[85%] px-3.5 py-2 text-sm"
                    style={{ backgroundColor: "#DCF8C6", borderRadius: "10px 10px 2px 10px", fontFamily, color: "#111B21" }}
                  >
                    {chosenMessage}
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-[10px]" style={{ color: "#667781" }}>ahora</span>
                      <CheckCheck size={13} color="#53BDEB" />
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="max-w-[85%] px-3.5 py-2 text-sm"
                    style={{ backgroundColor: "#fff", borderRadius: "10px 10px 10px 2px", fontFamily, color: "#111B21", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}
                  >
                    {autoReply}
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-[10px]" style={{ color: "#667781" }}>ahora</span>
                      <Check size={13} color="#667781" />
                    </div>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Pie con la nota de simulación y salida */}
            <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: "#F0F2F5" }}>
              {step === "result" ? (
                <>
                  <p className="text-[11px]" style={{ color: "#667781", fontFamily }}>
                    En la implementación final, esto abriría el WhatsApp real del negocio.
                  </p>
                  <button onClick={handleReset} className="text-xs font-medium shrink-0 ml-2" style={{ color: accentColor, fontFamily }}>
                    Elegir otro mensaje
                  </button>
                </>
              ) : (
                <button onClick={handleClose} className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "#667781", fontFamily }}>
                  <ArrowLeft size={14} /> Volver
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

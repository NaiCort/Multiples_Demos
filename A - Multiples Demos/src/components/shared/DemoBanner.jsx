import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Info, Mail, MessageCircle, ExternalLink, X, Sparkles } from "lucide-react"

// Barra superior global y permanente (Parte IV, sección 13, "Barra superior de demo").
// Vive en App.jsx, fuera de los temas, para que las seis demos la compartan sin duplicar lógica.
// Altura fija de 44px (h-11) — los navbars de cada tema se posicionan justo debajo (top-11)
// y las secciones con anchor suman esos 44px a su scrollMarginTop.

const WHATSAPP_URL = "https://wa.me/522281628345?text=" +
  encodeURIComponent("Hola Ian, vi una de tus demos y me interesa un sitio similar para mi negocio.")
const EMAIL_URL = "mailto:ian.martinez2610@gmail.com?subject=" +
  encodeURIComponent("Interesado en un sitio como tu demo") +
  "&body=" + encodeURIComponent("Hola Ian,\n\nVi tu demo y me gustaría platicar sobre un proyecto similar para mi negocio.\n\n")
const LINKEDIN_URL = "https://www.linkedin.com/in/ian-almarti/"

function Panel({ title, onClose, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full right-2 sm:right-4 mt-2 w-[calc(100vw-1rem)] sm:w-80 rounded-xl overflow-hidden"
      style={{ backgroundColor: "#1A1C22", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 12px 40px rgba(0,0,0,0.4)" }}
    >
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <p className="text-sm font-medium text-white" style={{ fontFamily: "system-ui, sans-serif" }}>{title}</p>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 transition-colors" aria-label="Cerrar">
          <X size={16} color="rgba(255,255,255,0.6)" />
        </button>
      </div>
      <div className="p-4">{children}</div>
    </motion.div>
  )
}

function ContactRow({ icon: Icon, label, sublabel, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-2.5 rounded-lg transition-colors hover:bg-white/5"
    >
      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
        <Icon size={16} color="#ffffff" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-white truncate" style={{ fontFamily: "system-ui, sans-serif" }}>{label}</p>
        <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "system-ui, sans-serif" }}>{sublabel}</p>
      </div>
    </a>
  )
}

export default function DemoBanner() {
  const [openPanel, setOpenPanel] = useState(null) // null | "about" | "contact"

  const togglePanel = (panel) => setOpenPanel(p => (p === panel ? null : panel))

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-11 flex items-center px-3 sm:px-5"
      style={{ backgroundColor: "#111318", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <Sparkles size={14} color="#F5B942" className="shrink-0" />
        <p className="text-xs sm:text-[13px] truncate" style={{ color: "rgba(255,255,255,0.75)", fontFamily: "system-ui, sans-serif" }}>
          <span className="hidden sm:inline">Demo interactiva para portafolio. La identidad, los datos, las citas y los envíos de este sitio son simulados.</span>
          <span className="sm:hidden">Demo interactiva — datos simulados</span>
        </p>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 shrink-0 relative">
        <button
          onClick={() => togglePanel("about")}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-medium transition-colors hover:bg-white/10"
          style={{ color: "rgba(255,255,255,0.85)", fontFamily: "system-ui, sans-serif" }}
        >
          <Info size={13} />
          <span className="hidden sm:inline">Cómo funciona</span>
        </button>

        <button
          onClick={() => togglePanel("contact")}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-medium transition-colors hover:opacity-90"
          style={{ backgroundColor: "#F5B942", color: "#1A1208", fontFamily: "system-ui, sans-serif" }}
        >
          <span className="hidden sm:inline">Solicitar un sitio similar</span>
          <span className="sm:hidden">Contactar</span>
        </button>

        <AnimatePresence>
          {openPanel === "about" && (
            <Panel title="Cómo funciona esta demo" onClose={() => setOpenPanel(null)}>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.75)", fontFamily: "system-ui, sans-serif" }}>
                Este sitio es un prototipo interactivo de alta fidelidad, no el sitio real de un negocio.
                Puedes cambiar el estilo visual con el selector de la esquina inferior derecha, recorrer
                cada sección y probar los formularios y flujos — todo responde de forma creíble, pero
                ningún dato se guarda ni se envía realmente.
              </p>
            </Panel>
          )}
          {openPanel === "contact" && (
            <Panel title="Hablemos de tu proyecto" onClose={() => setOpenPanel(null)}>
              <div className="space-y-1">
                <ContactRow icon={MessageCircle} label="WhatsApp" sublabel="+52 228 162 8345" href={WHATSAPP_URL} />
                <ContactRow icon={Mail} label="Correo" sublabel="ian.martinez2610@gmail.com" href={EMAIL_URL} />
                <ContactRow icon={ExternalLink} label="LinkedIn" sublabel="Ian Aldana Martínez" href={LINKEDIN_URL} />
              </div>
            </Panel>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

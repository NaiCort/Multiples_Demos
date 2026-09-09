import { useState } from "react"
import { Link } from "react-router-dom"
import { Info, Mail, MessageCircle, ExternalLink, MonitorPlay, ArrowLeft } from "lucide-react"
import Modal from "./Modal"
import OnboardingGuide from "./OnboardingGuide"
import { buildWhatsAppUrl, EMAIL_URL, LINKEDIN_URL } from "./contactInfo"

const WHATSAPP_URL = buildWhatsAppUrl("Hola Ian, vi una de tus demos y me interesa un sitio similar para mi negocio.")
function ContactRow({ icon: Icon, label, sublabel, href }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10">
    <Icon size={20} className="shrink-0" aria-hidden="true" />
    <span className="min-w-0"><span className="block text-sm text-white">{label}</span><span className="block text-sm text-slate-300 break-words">{sublabel}</span></span>
  </a>
}
export default function DemoBanner() {
  const [panel, setPanel] = useState(null)
  return <>
    <div className="fixed top-0 left-0 right-0 z-[60] h-11 flex items-center px-2 sm:px-5 gap-1" style={{ backgroundColor: "#111318", fontFamily: "system-ui, sans-serif" }}>
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <MonitorPlay size={14} color="#F5B942" className="shrink-0" aria-hidden="true" />
        <p className="text-xs truncate text-white/85">
          <span className="hidden lg:inline">Demo interactiva para portafolio. Identidad, datos, citas y envíos simulados.</span>
          <span className="lg:hidden">Demo · datos simulados</span>
        </p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Link to="/" aria-label="Volver al portafolio de demos" className="demo-icon-button sm:px-3 flex gap-1 text-white/90">
          <ArrowLeft size={16} aria-hidden="true" /><span className="hidden sm:inline text-xs">Ver todos los giros</span>
        </Link>
        <button type="button" onClick={() => setPanel("about")} aria-haspopup="dialog" aria-label="Cómo funciona esta demo" className="demo-icon-button sm:px-3 flex gap-1 text-white/90">
          <Info size={16} aria-hidden="true" /><span className="hidden sm:inline text-xs">Cómo funciona</span>
        </button>
        <button type="button" onClick={() => setPanel("contact")} aria-haspopup="dialog" className="min-h-10 px-3 rounded-full text-xs font-medium bg-[#F5B942] text-[#1A1208]">
          <span className="hidden sm:inline">Solicitar un sitio similar</span><span className="sm:hidden">Contactar</span>
        </button>
      </div>
    </div>
    {panel === "about" && <Modal title="Cómo funciona esta demo" onClose={() => setPanel(null)}><OnboardingGuide /></Modal>}
    {panel === "contact" && <Modal title="Hablemos de tu proyecto" onClose={() => setPanel(null)}>
      <p className="text-sm text-slate-300 mb-3">Estos son los canales reales de Ian.</p>
      <ContactRow icon={MessageCircle} label="WhatsApp" sublabel="+52 228 162 8345" href={WHATSAPP_URL} />
      <ContactRow icon={Mail} label="Correo" sublabel="ian.martinez2610@gmail.com" href={EMAIL_URL} />
      <ContactRow icon={ExternalLink} label="LinkedIn" sublabel="Ian Aldana Martínez" href={LINKEDIN_URL} />
    </Modal>}
  </>
}

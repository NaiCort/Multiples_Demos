import { Palette, MousePointerClick, CalendarCheck } from "lucide-react"

// Ayuda a petición: no tapa el contenido ni interrumpe la primera visita.
const TIPS = [
  { icon: Palette, text: "Cambia el estilo con el selector de la esquina inferior derecha." },
  { icon: MousePointerClick, text: "Elige un servicio y comprueba las modalidades disponibles." },
  { icon: CalendarCheck, text: "Completa una reserva simulada o prueba el formulario con datos de ejemplo." },
]
export default function OnboardingGuide() {
  return <div className="space-y-4 text-sm leading-relaxed text-slate-300">
    <p>Este sitio representa un negocio ficticio. Las reservas, las reseñas y los mensajes sirven para explorar el prototipo.</p>
    <ul className="space-y-4">
      {TIPS.map(({ icon: Icon, text }) => <li key={text} className="flex items-start gap-3"><Icon size={20} className="shrink-0 text-[#F5B942]" aria-hidden="true" /><span>{text}</span></li>)}
    </ul>
    <p>“Contactar” y “Hablemos” abren los canales reales de Ian para consultar un proyecto.</p>
  </div>
}

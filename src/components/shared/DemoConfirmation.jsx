import { useEffect, useRef } from "react"
import { CheckCircle2 } from "lucide-react"
import { contrastingText, dialogAccent } from "../../utils/colors"

export default function DemoConfirmation({
  message = "Demostración completada. El formulario no ha enviado datos ni generado una solicitud real.",
  onReset, onClose, accentColor, borderColor = "rgba(255,255,255,0.25)", fontFamily, radius = 8,
}) {
  const ref = useRef(null)
  const accent = dialogAccent(accentColor)
  useEffect(() => { ref.current?.focus({ preventScroll: true }) }, [])
  return (
    <div ref={ref} tabIndex={-1} className="p-6 text-center" style={{ backgroundColor: "rgba(255,255,255,0.06)", border: `1px solid ${borderColor}`, borderRadius: radius }}>
      <CheckCircle2 size={28} style={{ color: accent, margin: "0 auto 12px" }} aria-hidden="true" />
      <p role="status" style={{ fontFamily, color: "#ffffff", fontSize: 14, lineHeight: 1.7 }}>{message}</p>
      <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
        <button type="button" onClick={onReset} className="px-5 py-3 text-sm font-medium" style={{ backgroundColor: accent, color: contrastingText(accent), fontFamily, borderRadius: radius }}>Reiniciar demo</button>
        <button type="button" onClick={onClose} className="px-5 py-3 text-sm text-white/85" style={{ fontFamily }}>Cerrar</button>
      </div>
    </div>
  )
}

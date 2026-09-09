import { useEffect, useRef, useState } from "react"
import { Check, ChevronLeft } from "lucide-react"
import Modal from "./Modal"
import DemoConfirmation from "./DemoConfirmation"
import { contrastingText, dialogAccent } from "../../utils/colors"

const HORARIOS = ["Lunes 10:00 am", "Miércoles 4:00 pm", "Viernes 12:00 pm"]

function OptionCard({ label, sublabel, selected, onClick, accentColor, disabled }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-pressed={selected}
      className="w-full text-left px-4 py-3 rounded-lg flex items-center justify-between gap-3 border"
      style={{ borderColor: selected ? accentColor : "#69717d", background: selected ? `${accentColor}14` : "transparent" }}>
      <span>
        <span className="block text-sm font-medium">{label}</span>
        {sublabel && <span className="block text-xs text-slate-300 mt-1">{sublabel}</span>}
      </span>
      {selected && <Check size={18} style={{ color: accentColor }} aria-hidden="true" />}
    </button>
  )
}

function ReservationContent({ onClose, services, preselectedService, accentColor, fontFamily, radius, accionLabel }) {
  const initialService = services.find(item => item.id === preselectedService?.id) || null
  const [state, setState] = useState(() => ({ step: initialService ? "horario" : "servicio", service: initialService, modalidad: null, horario: null, processing: false, done: false }))
  const timer = useRef(null)
  const busy = useRef(false)
  const stepHeading = useRef(null)
  const { step, service, modalidad, horario, processing, done } = state
  const accent = dialogAccent(accentColor)
  const modalities = service?.modalities || []
  const canContinue = step === "servicio" ? services.includes(service) : services.includes(service) && modalities.includes(modalidad) && HORARIOS.includes(horario)

  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => { stepHeading.current?.focus({ preventScroll: true }) }, [step])

  const chooseService = (nextService) => setState(previous => ({ ...previous, service: nextService, modalidad: null, horario: null }))
  const next = () => {
    if (!canContinue || busy.current) return
    if (step === "servicio") {
      setState(previous => ({ ...previous, step: "horario" }))
      return
    }
    busy.current = true
    setState(previous => ({ ...previous, processing: true }))
    timer.current = setTimeout(() => {
      busy.current = false
      setState(previous => ({ ...previous, processing: false, done: true, step: "confirmacion" }))
    }, 800)
  }
  const reset = () => {
    clearTimeout(timer.current)
    busy.current = false
    setState({ step: "servicio", service: null, modalidad: null, horario: null, processing: false, done: false })
  }

  return (
    <Modal title={`Simular reserva de ${accionLabel}`} onClose={onClose} fontFamily={fontFamily} radius={radius}>
      <p className="text-sm text-slate-300 mb-5">Horarios de ejemplo. Este recorrido no crea una cita real.</p>
      {!done && <h3 ref={stepHeading} tabIndex={-1} className="font-medium mb-4">{step === "servicio" ? "1 de 3 · Elige un servicio" : "2 de 3 · Modalidad y horario"}</h3>}
      <div aria-busy={processing}>
        {step === "servicio" && <div className="space-y-3">
          {services.map(item => <OptionCard key={item.id} label={item.title} sublabel={item.duration}
            selected={service?.id === item.id} onClick={() => chooseService(item)} accentColor={accent} />)}
        </div>}
        {step === "horario" && <div className="space-y-5">
          <p className="text-sm">{service.title} · {service.duration}</p>
          <fieldset disabled={processing} className="space-y-3">
            <legend className="text-sm mb-3 text-slate-300">Modalidad</legend>
            <div className="flex flex-wrap gap-3">
              {modalities.map(value => <div key={value} className="flex-1 min-w-28">
                <OptionCard label={value} selected={modalidad === value} disabled={processing} accentColor={accent}
                  onClick={() => setState(previous => ({ ...previous, modalidad: value, horario: null }))} />
              </div>)}
            </div>
          </fieldset>
          <fieldset disabled={processing || !modalidad} className="space-y-3">
            <legend className="text-sm mb-3 text-slate-300">Horario de ejemplo{!modalidad && " · selecciona primero la modalidad"}</legend>
            {HORARIOS.map(value => <OptionCard key={value} label={value} selected={horario === value} disabled={processing || !modalidad} accentColor={accent}
              onClick={() => setState(previous => ({ ...previous, horario: value }))} />)}
          </fieldset>
        </div>}
      </div>
      <p role="status" className="text-sm text-slate-300 mt-4">{processing ? "Simulando reserva…" : ""}</p>
      {done && <DemoConfirmation message={`Reserva simulada. Has elegido ${service.title}, modalidad ${modalidad} y el horario de ejemplo ${horario}. No se generó una reserva real.`}
        onReset={reset} onClose={onClose} accentColor={accent} fontFamily={fontFamily} radius={8} />}
      {!done && <div className="flex items-center justify-between gap-3 mt-5">
        {step === "horario" ? <button type="button" disabled={processing} className="text-sm min-h-11 flex items-center gap-1"
          onClick={() => setState(previous => ({ ...previous, step: "servicio" }))}><ChevronLeft size={16} /> Cambiar servicio</button> : <span />}
        <button type="button" onClick={next} disabled={!canContinue || processing} className="px-4 py-3 text-sm font-medium rounded-lg"
          style={{ backgroundColor: accent, color: contrastingText(accent) }}>
          {step === "horario" ? "Confirmar reserva" : "Continuar"}
        </button>
      </div>}
    </Modal>
  )
}

export default function ReservationFlow({ isOpen, services = [], preselectedService = null, accentColor = "#d8e5dc", radius = 16, accionLabel = "cita", ...props }) {
  return isOpen ? <ReservationContent services={services} preselectedService={preselectedService} accentColor={accentColor} radius={radius} accionLabel={accionLabel} {...props} /> : null
}

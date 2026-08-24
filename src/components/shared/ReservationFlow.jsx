import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check, ChevronLeft } from "lucide-react"
import DemoConfirmation from "./DemoConfirmation"

// Flujo de reserva simulado de varios pasos (Parte III, Fase 2 del Documento Maestro):
// selección de servicio → modalidad/horario → confirmación, siguiendo el modelo de
// 5 estados (Parte IV, sección 11). Copy de confirmación tomado de la Parte IV, sección 13.
//
// El contenido con estado (ReservationFlowModal) solo se monta mientras isOpen es true,
// así que cada apertura nace ya con el estado correcto (según preselectedService) sin
// necesitar un efecto que lo reinicie después del montaje.

const HORARIOS = ["Lunes 10:00 am", "Miércoles 4:00 pm", "Viernes 12:00 pm"]

function OptionCard({ label, sublabel, selected, onClick, accentColor, mutedColor, borderColor, fontFamily, radius }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left px-4 py-3 transition-all flex items-center justify-between gap-3"
      style={{
        border: `1.5px solid ${selected ? accentColor : borderColor}`,
        backgroundColor: selected ? `${accentColor}14` : "transparent",
        borderRadius: radius,
      }}
    >
      <div>
        <p style={{ fontFamily, color: "#fff", fontSize: 14, fontWeight: 500 }}>{label}</p>
        {sublabel && <p style={{ fontFamily, color: mutedColor, fontSize: 12, marginTop: 2 }}>{sublabel}</p>}
      </div>
      {selected && <Check size={16} style={{ color: accentColor, flexShrink: 0 }} />}
    </button>
  )
}

function ReservationFlowModal({
  onClose, services, preselectedService,
  accentColor, accentTextColor, mutedColor, borderColor, fontFamily, headingFontFamily, radius, accionLabel,
}) {
  const [state, setState] = useState({
    step: preselectedService ? "horario" : "servicio",
    service: preselectedService,
    modalidad: null,
    horario: null,
    processing: false,
    done: false,
  })
  const { step, service, modalidad, horario, processing, done } = state

  const setService = (s) => setState((prev) => ({ ...prev, service: s }))
  const setModalidad = (m) => setState((prev) => ({ ...prev, modalidad: m }))
  const setHorario = (h) => setState((prev) => ({ ...prev, horario: h }))
  const setStep = (s) => setState((prev) => ({ ...prev, step: s }))

  const modalidades = service?.mode?.toLowerCase().includes("presencial") && service?.mode?.toLowerCase().includes("online")
    ? ["Presencial", "Online"]
    : [service?.mode?.includes("Online") ? "Online" : "Presencial"]

  const canContinue = step === "servicio" ? !!service : step === "horario" ? !!modalidad && !!horario : true

  const handleNext = () => {
    if (step === "servicio") setStep("horario")
    else if (step === "horario") {
      setState((prev) => ({ ...prev, processing: true }))
      setTimeout(() => {
        setState((prev) => ({ ...prev, processing: false, done: true, step: "confirmacion" }))
      }, 800)
    }
  }

  const handleBack = () => {
    if (step === "horario" && !preselectedService) setStep("servicio")
  }

  const handleReset = () => {
    setState((prev) => ({ ...prev, service: null, modalidad: null, horario: null, done: false, step: "servicio" }))
  }

  const stepIndex = step === "servicio" ? 0 : step === "horario" ? 1 : 2
  const steps = ["Servicio", "Horario", "Confirmación"]

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[90]"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.25 }}
        role="dialog"
        aria-modal="true"
        className="fixed z-[91] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-w-md p-6 max-h-[85vh] overflow-y-auto"
        style={{ backgroundColor: "#16181D", border: "1px solid rgba(255,255,255,0.1)", borderRadius: radius }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 style={{ fontFamily: headingFontFamily || fontFamily, color: "#fff", fontSize: 17 }}>
            Simular reserva de {accionLabel}
          </h3>
          <button onClick={onClose} aria-label="Cerrar" className="p-1 rounded-full hover:bg-white/10">
            <X size={18} color="rgba(255,255,255,0.6)" />
          </button>
        </div>

        {!done && (
          <div className="flex items-center gap-2 mb-6">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0"
                  style={{
                    backgroundColor: i <= stepIndex ? accentColor : "rgba(255,255,255,0.1)",
                    color: i <= stepIndex ? accentTextColor : mutedColor,
                    fontFamily,
                  }}>
                  {i < stepIndex ? <Check size={12} /> : i + 1}
                </div>
                <span className="text-xs hidden sm:inline" style={{ color: i <= stepIndex ? "#fff" : mutedColor, fontFamily }}>{s}</span>
                {i < steps.length - 1 && <div className="flex-1 h-px" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />}
              </div>
            ))}
          </div>
        )}

        {step === "servicio" && !done && (
          <div className="space-y-2.5">
            <p className="text-xs mb-3" style={{ color: mutedColor, fontFamily }}>Elige el servicio que te interesa:</p>
            {services.map((s, i) => (
              <OptionCard key={i} label={s.title} sublabel={s.duration}
                selected={service?.title === s.title}
                onClick={() => setService(s)}
                accentColor={accentColor} mutedColor={mutedColor} borderColor={borderColor} fontFamily={fontFamily} radius={radius > 16 ? 10 : radius} />
            ))}
          </div>
        )}

        {step === "horario" && !done && (
          <div className="space-y-5">
            <div>
              <p className="text-xs mb-3" style={{ color: mutedColor, fontFamily }}>Modalidad:</p>
              <div className="flex gap-2.5">
                {modalidades.map((m) => (
                  <div key={m} className="flex-1">
                    <OptionCard label={m} selected={modalidad === m} onClick={() => setModalidad(m)}
                      accentColor={accentColor} mutedColor={mutedColor} borderColor={borderColor} fontFamily={fontFamily} radius={radius > 16 ? 10 : radius} />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs mb-3" style={{ color: mutedColor, fontFamily }}>Horario de ejemplo:</p>
              <div className="space-y-2.5">
                {HORARIOS.map((h) => (
                  <OptionCard key={h} label={h} selected={horario === h} onClick={() => setHorario(h)}
                    accentColor={accentColor} mutedColor={mutedColor} borderColor={borderColor} fontFamily={fontFamily} radius={radius > 16 ? 10 : radius} />
                ))}
              </div>
            </div>
          </div>
        )}

        {processing && (
          <div className="flex items-center justify-center py-10">
            <motion.p animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }}
              style={{ color: mutedColor, fontFamily, fontSize: 14 }}>
              Simulando reserva…
            </motion.p>
          </div>
        )}

        {done && (
          <DemoConfirmation
            message={`Reserva simulada. Has elegido ${service?.title}, modalidad ${modalidad} y el horario de ejemplo ${horario}. No se generó una reserva real.`}
            onReset={handleReset}
            onClose={onClose}
            accentColor={accentColor}
            accentTextColor={accentTextColor}
            mutedColor={mutedColor}
            borderColor={borderColor}
            fontFamily={fontFamily}
            radius={radius > 16 ? 10 : radius}
          />
        )}

        {!done && !processing && (
          <div className="flex items-center justify-between mt-6">
            {step === "horario" && !preselectedService ? (
              <button onClick={handleBack} className="flex items-center gap-1 text-xs" style={{ color: mutedColor, fontFamily }}>
                <ChevronLeft size={14} /> Atrás
              </button>
            ) : <span />}
            <button
              onClick={handleNext}
              disabled={!canContinue}
              className="px-5 py-2.5 text-sm font-medium transition-opacity"
              style={{
                backgroundColor: accentColor, color: accentTextColor, fontFamily,
                borderRadius: radius > 16 ? 999 : radius,
                opacity: canContinue ? 1 : 0.4,
                cursor: canContinue ? "pointer" : "not-allowed",
              }}
            >
              {step === "horario" ? "Confirmar reserva" : "Continuar"}
            </button>
          </div>
        )}
      </motion.div>
    </>
  )
}

export default function ReservationFlow({
  isOpen,
  onClose,
  services = [],
  preselectedService = null,
  accentColor,
  accentTextColor = "#ffffff",
  mutedColor = "rgba(255,255,255,0.55)",
  borderColor = "rgba(255,255,255,0.18)",
  fontFamily,
  headingFontFamily,
  radius = 10,
  accionLabel = "cita",
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <ReservationFlowModal
          onClose={onClose}
          services={services}
          preselectedService={preselectedService}
          accentColor={accentColor}
          accentTextColor={accentTextColor}
          mutedColor={mutedColor}
          borderColor={borderColor}
          fontFamily={fontFamily}
          headingFontFamily={headingFontFamily}
          radius={radius}
          accionLabel={accionLabel}
        />
      )}
    </AnimatePresence>
  )
}

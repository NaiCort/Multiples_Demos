import { useEffect, useRef, useState } from "react"
import { CheckCheck, MessageCircle } from "lucide-react"
import Modal from "./Modal"

const DEFAULT_MESSAGES = [
  "Hola, me gustaría agendar una primera cita",
  "Hola, tengo algunas dudas antes de agendar",
  "Hola, ¿tienen disponibilidad esta semana?",
]

function Conversation({ onClose, businessName = "Valeria Romero", autoReply = "¡Hola! Gracias por escribir. Te responderé lo antes posible para coordinar los detalles.", messages = DEFAULT_MESSAGES, fontFamily, radius }) {
  const [step, setStep] = useState("selection")
  const [chosenMessage, setChosenMessage] = useState(null)
  const timer = useRef(null)
  const busy = useRef(false)
  const resultRef = useRef(null)
  const selectionRef = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => {
    if (step === "result") resultRef.current?.focus()
    if (step === "selection") selectionRef.current?.focus()
  }, [step])

  const choose = message => {
    if (busy.current) return
    busy.current = true
    setChosenMessage(message)
    setStep("processing")
    timer.current = setTimeout(() => { busy.current = false; setStep("result") }, 750)
  }
  const reset = () => {
    clearTimeout(timer.current)
    busy.current = false
    setChosenMessage(null)
    setStep("selection")
  }

  return (
    <Modal title="WhatsApp de demostración" onClose={onClose} fontFamily={fontFamily} radius={radius} className="demo-chat">
      <div className="flex items-center gap-3 bg-[#075E54] text-white rounded-t-xl p-4">
        <MessageCircle size={24} aria-hidden="true" />
        <div><p className="font-medium">{businessName}</p><p className="text-xs text-white/85">Personaje ficticio · conversación simulada</p></div>
      </div>
      <div className="bg-[#ECE5DD] text-[#111B21] p-4 min-h-56">
        {step === "selection" && <fieldset ref={selectionRef} tabIndex={-1} className="space-y-3">
          <legend className="text-sm mb-3">Elige qué mensaje enviarías:</legend>
          {messages.map(message => <button key={message} type="button" onClick={() => choose(message)}
            className="block w-full rounded-lg p-3 bg-white text-left text-sm shadow-sm hover:bg-[#f2faf0]">{message}</button>)}
        </fieldset>}
        {step === "processing" && <p role="status" className="text-sm py-12 text-center">Simulando envío…</p>}
        {step === "result" && <div ref={resultRef} tabIndex={-1} aria-label="Conversación simulada" className="space-y-3">
          <p className="ml-auto max-w-[90%] bg-[#DCF8C6] rounded-lg p-3 text-sm">{chosenMessage}<CheckCheck className="ml-auto mt-1" size={16} aria-hidden="true" /></p>
          <p className="mr-auto max-w-[90%] bg-white rounded-lg p-3 text-sm">{autoReply}</p>
          <p role="status" className="text-xs pt-2">Simulación completada. No se ha enviado ningún mensaje.</p>
        </div>}
      </div>
      <p className="text-sm text-slate-300 mt-4">En un sitio real, este botón abriría el WhatsApp del negocio.</p>
      <div className="flex flex-wrap gap-3 justify-between mt-4">
        <button type="button" onClick={onClose} className="px-4 py-3 text-sm">Volver a la demo</button>
        {step === "result" && <button type="button" onClick={reset} className="px-4 py-3 text-sm rounded-lg bg-[#d4eddf] text-[#163729]">Elegir otro mensaje</button>}
      </div>
    </Modal>
  )
}

export default function WhatsAppPreview({ isOpen, ...props }) {
  return isOpen ? <Conversation {...props} /> : null
}

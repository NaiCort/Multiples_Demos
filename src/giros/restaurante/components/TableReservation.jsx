import { useEffect, useRef, useState } from "react"
import { Check } from "lucide-react"
import Modal from "../../../components/shared/Modal"
import { reservationTimes, upcomingDates } from "../data/reservation"

export default function TableReservation({ onClose }) {
  const [dates] = useState(upcomingDates)
  const [date, setDate] = useState("")
  const [party, setParty] = useState("2")
  const [time, setTime] = useState("")
  const [name, setName] = useState("Alex Demo")
  const [step, setStep] = useState(1)
  const timer = useRef(null)
  const heading = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => { heading.current?.focus({ preventScroll: true }) }, [step])
  const dateLabel = dates.find(day => day.id === date)?.label
  const reset = () => { setDate(""); setParty("2"); setTime(""); setName("Alex Demo"); setStep(1) }
  const submit = () => {
    if (!dateLabel || !reservationTimes(party).some(slot => slot.time === time && slot.available) || name.trim().length < 2) return
    setStep("processing")
    timer.current = setTimeout(() => setStep("done"), 800)
  }
  return <Modal title="Reservar una mesa de ejemplo" onClose={onClose} className="restaurant-modal" fontFamily="'Patio Sans', sans-serif" radius={4}>
    {step === "done" ? <div className="r-result"><span className="r-result-icon"><Check size={28} aria-hidden="true" /></span>
      <h3 ref={heading} tabIndex={-1}>Reserva simulada completada</h3><p><strong>{party} personas · {dateLabel} · {time}</strong></p><p>A nombre de {name.trim()}.</p>
      <p className="r-demo-note">No se reservó una mesa ni se transmitieron datos. Las fechas y la disponibilidad sirven para probar el recorrido.</p>
      <button type="button" className="r-button r-full" onClick={reset}>Probar otra reserva</button><button type="button" className="r-text-button r-full" onClick={onClose}>Finalizar</button>
    </div> : step === "processing" ? <div className="r-processing" role="status" aria-live="polite"><span className="r-spinner" aria-hidden="true" /><h3 ref={heading} tabIndex={-1}>Simulando reserva…</h3><p>Sin reservar una mesa real.</p></div> : <>
      <p className="r-progress">{step} de 2 · {step === 1 ? "Fecha y compañía" : "Hora y confirmación"}</p>
      {step === 1 ? <><h3 ref={heading} tabIndex={-1} className="r-sr-only">Fecha y número de personas</h3>
        <label className="r-field">Personas<select aria-label="Personas" value={party} onChange={event => { setParty(event.target.value); setTime("") }}>{[1, 2, 3, 4, 5, 6].map(count => <option key={count} value={count}>{count} {count === 1 ? "persona" : "personas"}</option>)}</select></label>
        <label className="r-field">Fecha de ejemplo<select aria-label="Fecha de ejemplo" value={date} onChange={event => { setDate(event.target.value); setTime("") }}><option value="">Elige un día</option>{dates.map(day => <option key={day.id} value={day.id}>{day.label}</option>)}</select></label>
        <p className="r-muted">Martes a domingo. Lunes cerrado. Para grupos de más de seis personas, en un sitio real se solicitaría una atención específica.</p>
        <button type="button" className="r-button r-full" disabled={!date} onClick={() => setStep(2)}>Ver horarios</button>
      </> : <>
        <h3 ref={heading} tabIndex={-1} className="r-reservation-summary">{party} personas · {dateLabel}</h3>
        <fieldset className="r-options"><legend>Horarios de ejemplo</legend><div className="r-time-grid">{reservationTimes(party).map(slot => <button key={slot.time} type="button" className="r-time" disabled={!slot.available} aria-pressed={time === slot.time} onClick={() => setTime(slot.time)}>{slot.time}<small>{slot.available ? "Disponible" : "Sin mesas para este grupo"}</small></button>)}</div></fieldset>
        <label className="r-field">Nombre de ejemplo<input value={name} maxLength={60} autoComplete="off" onChange={event => setName(event.target.value)} aria-invalid={name.trim().length < 2} aria-describedby={`reservation-fiction${name.trim().length < 2 ? " reservation-name-error" : ""}`} /></label>
        {name.trim().length < 2 && <p id="reservation-name-error" className="r-error">Escribe un nombre ficticio de al menos dos caracteres.</p>}
        <button type="button" className="r-button r-full" disabled={!time || name.trim().length < 2} onClick={submit}>Simular reserva</button>
        <button type="button" className="r-text-button r-full" onClick={() => setStep(1)}>Cambiar fecha o personas</button>
      </>}
      <p id="reservation-fiction" className="r-demo-note">Usa únicamente datos ficticios. Este recorrido no confirma disponibilidad real.</p>
    </>}
  </Modal>
}

import { useState } from "react"
import Modal from "../../../components/shared/Modal"
import { createVisit } from "../state/model"
import { useRestaurant } from "../state/context"
import { localLabel, POINTS, pointOrDefault } from "../data/locations"
import PatioSeal from "./PatioSeal"
import ServiceOptions from "./ServiceOptions"
export default function ServiceChoice({ onClose, onReservation, initial = false }) {
  const { state, dispatch } = useRestaurant()
  const [people, setPeople] = useState(state.visit?.people || 2)
  const select = mode => { if (state.visit?.mode !== mode || state.visit?.people !== people) dispatch({ type: "start", visit: createVisit(mode, people, undefined, state.pointId) }); onClose(mode) }
  const content = <>
    <div className="r-welcome"><PatioSeal small /><p className="r-muted">¿Cómo quieres disfrutar el patio? Entra como invitado y explora a tu ritmo.</p></div>
    <p className="r-demo-note">Local simulado: {localLabel(state.pointId)}. Referencia: {pointOrDefault(state.pointId).name}.</p>
    <ServiceOptions onSelect={select} />
    <details className="r-entry-settings"><summary>Local y número de personas</summary>
      {state.visit?.mode === "dine" && <p className="r-demo-note">Cambiar el local reinicia la espera y la asignación de mesa; conserva los platos elegidos.</p>}
      <label className="r-field">Local simulado<select aria-label="Local simulado" value={state.pointId} onChange={event => dispatch({ type: "point", pointId: event.target.value })}>{POINTS.map(point => <option key={point.id} value={point.id}>{localLabel(point.id)}</option>)}</select></label>
      <label className="r-field">Personas, si comes aquí<select value={people} onChange={event => setPeople(Number(event.target.value))}>{[1, 2, 3, 4, 5, 6].map(number => <option key={number} value={number}>{number} {number === 1 ? "persona" : "personas"}</option>)}</select></label>
    </details>
    <button type="button" className="r-text-button r-full" onClick={onReservation}>Quiero reservar para otra fecha</button>
    <p className="r-demo-note">Patio 12 es ficticio. La espera, las mesas y los pedidos son simulados. No necesitas una cuenta.</p>
  </>
  return initial ? <Modal title="Bienvenido al patio" onClose={() => select("pickup")} className="restaurant-modal" radius={4}>{content}<button type="button" className="r-text-button r-full" onClick={() => select("pickup")}>Solo explorar · usar para llevar</button></Modal> : <Modal title="Cómo quieres comer" onClose={() => onClose()} className="restaurant-modal" radius={4}>{state.order && state.order.status !== "completed" ? <><p className="r-muted">Tu pedido ya está confirmado. Termina este recorrido antes de elegir otra modalidad.</p><button type="button" className="r-button r-full" onClick={() => onClose()}>Volver a mi pedido</button></> : content}</Modal>
}

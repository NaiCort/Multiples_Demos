import { useState } from "react"
import { ArrowUpRight, Bike, ShoppingBag, UtensilsCrossed } from "lucide-react"
import Modal from "../../../components/shared/Modal"
import { createVisit } from "../state/model"
import { useRestaurant } from "../state/context"
import { POINTS, pointOrDefault } from "../data/locations"
import PatioSeal from "./PatioSeal"
export default function ServiceChoice({ onClose, onReservation, initial = false }) {
  const { state, dispatch } = useRestaurant()
  const [people, setPeople] = useState(state.visit?.people || 2)
  const select = mode => { dispatch({ type: "start", visit: createVisit(mode, people, undefined, state.pointId) }); onClose(mode) }
  const content = <>
    <div className="r-welcome"><PatioSeal small /><p className="r-muted">¿Cómo quieres disfrutar el patio? Entra como invitado y explora a tu ritmo.</p></div>
    <p className="r-demo-note">Referencia: {pointOrDefault(state.pointId).name}. No es una sucursal real.</p>
    <div className="r-service-options">{[["dine", "Comer aquí", "Espera de mesa de un minuto. Puedes explorar y saltar la espera de prueba.", UtensilsCrossed], ["pickup", "Para llevar", "Haz tu pedido y recibe un turno para recogerlo, sin reservar una mesa.", ShoppingBag], ["delivery", "A domicilio", "Prueba una dirección ficticia y una zona de entrega de ejemplo.", Bike]].map(([mode, title, text, Icon]) => <button type="button" className="r-service-card" key={mode} aria-label={title} onClick={() => select(mode)}><Icon size={25} aria-hidden="true" /><span><strong>{title}</strong><small>{text}</small></span><ArrowUpRight size={19} aria-hidden="true" /></button>)}</div>
    <details className="r-entry-settings"><summary>Punto y número de personas</summary>
      <label className="r-field">Punto de demostración<select value={state.pointId} onChange={event => dispatch({ type: "point", pointId: event.target.value })}>{POINTS.map(point => <option key={point.id} value={point.id}>{point.name} · {point.city}</option>)}</select></label>
      <label className="r-field">Personas, si comes aquí<select value={people} onChange={event => setPeople(Number(event.target.value))}>{[1, 2, 3, 4, 5, 6].map(number => <option key={number} value={number}>{number} {number === 1 ? "persona" : "personas"}</option>)}</select></label>
    </details>
    <button type="button" className="r-text-button r-full" onClick={onReservation}>Quiero reservar para otra fecha</button>
    <p className="r-demo-note">Patio 12 es ficticio. La espera, las mesas y los pedidos son simulados. No necesitas una cuenta.</p>
  </>
  return initial ? <Modal title="Bienvenido al patio" onClose={() => select("pickup")} className="restaurant-modal" radius={4}>{content}<button type="button" className="r-text-button r-full" onClick={() => select("pickup")}>Solo explorar · usar para llevar</button></Modal> : <Modal title="Cómo quieres comer" onClose={() => onClose()} className="restaurant-modal" radius={4}>{state.order && state.order.status !== "completed" ? <><p className="r-muted">Tu pedido ya está confirmado. Termina este recorrido antes de elegir otra modalidad.</p><button type="button" className="r-button r-full" onClick={() => onClose()}>Volver a mi pedido</button></> : content}</Modal>
}

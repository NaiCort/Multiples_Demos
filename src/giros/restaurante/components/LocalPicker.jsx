import { useState } from "react"
import Modal from "../../../components/shared/Modal"
import { localLabel, POINTS, pointOrDefault } from "../data/locations"
import { useRestaurant } from "../state/context"

export default function LocalPicker({ onClose, onSelected, initialId, independent = false }) {
  const { state, dispatch } = useRestaurant()
  const [id, setId] = useState(initialId || state.pointId)
  const point = pointOrDefault(id)
  const locked = !independent && state.order && state.order.status !== "completed"
  return <Modal title={independent ? "Local de la reserva" : "Elegir local simulado"} onClose={onClose} className="restaurant-modal" radius={8}>
    {locked ? <><p className="r-muted">Tu pedido confirmado pertenece a {localLabel(state.order.pointId)}. Puedes explorar las fichas de otros locales; para pedir en otro, termina este recorrido.</p><button type="button" className="r-button r-full" onClick={onClose}>Conservar mi pedido</button></> : <>
      <p className="r-muted">{independent ? "Este local se usará únicamente para esta reserva. Tu visita y pedido actuales se conservan." : "Este local se usará para tu visita y pedido. La carta de esta demo es la misma en todos."}</p>
      <label className="r-field">Local simulado<select aria-label="Local simulado" value={id} onChange={event => setId(event.target.value)}>{POINTS.map(item => <option key={item.id} value={item.id}>{localLabel(item.id)}</option>)}</select></label>
      <p className="r-demo-note">Referencia geográfica: {point.name}, {point.city}. No existe un restaurante de Patio 12 en este lugar.</p>
      {!independent && state.visit?.mode === "dine" && id !== state.pointId && <p className="r-wait-notice">Cambiar de local reinicia la espera y la asignación de mesa. Los platos que ya elegiste se conservan.</p>}
      <button type="button" className="r-button r-full" onClick={() => { if (!independent) dispatch({ type: "point", pointId: id }); if (onSelected) onSelected(id); else onClose() }}>{id === state.pointId ? "Continuar con este local" : "Usar este local"}</button>
    </>}
  </Modal>
}

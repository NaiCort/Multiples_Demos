import Modal from "../../../components/shared/Modal"
import { useRestaurant } from "../state/context"
import { createVisit } from "../state/model"
import PatioSeal from "./PatioSeal"
export default function EntryPanel({ entry, onClose, onStart }) {
  const { state, dispatch } = useRestaurant()
  const active = state.visit || state.order && state.order.status !== "completed"
  return <Modal title={entry.valid ? entry.table ? `QR de mesa ${entry.table}` : "Entrada al punto de demostración" : "Este enlace no es válido"} onClose={onClose} className="restaurant-modal" radius={8}>
    <PatioSeal small />
    {entry.valid ? <><h3>{entry.point.name}</h3><p className="r-muted">{entry.point.city}. Referencia de demostración; no existe una sucursal aquí.</p><p className="r-demo-note">{entry.table ? "Este acceso representa a alguien que ya ocupa la mesa. No hay espera de un minuto ni reserva futura. En un servicio real, la mesa tendría que validarse en el servidor." : "Elige este punto y después cómo quieres comer. La modalidad Comer aquí conserva su espera de demostración."}</p>
      {active ? <><p className="r-wait-notice">Ya tienes una visita activa. Este enlace no la sustituye ni cambia un pedido confirmado. Finalízala o reinicia los datos desde Mi perfil para probar otro QR.</p><button type="button" className="r-button r-full" onClick={onClose}>Conservar mi visita</button></> : <button type="button" className="r-button r-full" onClick={() => { if (entry.table) dispatch({ type: "start", visit: createVisit("dine", 2, Date.now(), entry.point.id, entry.table) }); else dispatch({ type: "point", pointId: entry.point.id }); onStart(!!entry.table) }}>{entry.table ? `Sentarme en la mesa ${entry.table} · demo` : "Elegir este punto"}</button>}
    </> : <><p className="r-muted">El punto no existe o la mesa no está entre 1 y 25. Tu pedido, si existe, se conserva.</p><button type="button" className="r-button r-full" onClick={onClose}>Continuar con la demo</button></>}
  </Modal>
}

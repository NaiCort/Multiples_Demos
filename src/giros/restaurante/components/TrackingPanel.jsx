import { motion, useReducedMotion } from "framer-motion"
import { Check, UtensilsCrossed } from "lucide-react"
import Modal from "../../../components/shared/Modal"
import { money } from "../data/menu"
import { configSummary, findProduct, MODES, unitPrice, ZONES } from "../data/order"
import { useRestaurant } from "../state/context"
import { formatClock, remainingSeconds } from "../state/model"
import { pointOrDefault, pointTime } from "../data/locations"
import DemoMap from "./DemoMap"
import PatioSeal from "./PatioSeal"
const STATUS_LABELS = { preparing: "En preparación", ready: "Pedido listo", delivering: "En camino", delivered: "Entrega completada", completed: "Visita finalizada" }
export function Receipt({ order }) {
  const point = pointOrDefault(order.pointId)
  return <div className="r-receipt-content"><PatioSeal small /><p className="r-demo-note">Referencia: {point.name}, {point.city}. {new Intl.DateTimeFormat("es-MX", { timeZone: point.timeZone, dateStyle: "medium", timeStyle: "short" }).format(order.createdAt)} · {point.timeZone}. No es una sucursal.</p><p className="r-receipt-id">Referencia única de ejemplo <strong>{order.id}</strong></p><p>{MODES[order.mode]}{order.table ? ` · Mesa ${order.table}` : ""}{order.mode === "pickup" ? ` · Turno ${order.turn}` : ""}</p><ul className="r-receipt">{order.rows.map(row => <li key={row.key}><div><strong>{row.quantity} × {findProduct(row.productId).name}</strong>{configSummary(findProduct(row.productId), row.config).map(text => <small key={text}>{text}</small>)}</div><span>{money(row.quantity * unitPrice(row))}</span></li>)}</ul><div className="r-price-summary"><p>Platos y bebidas<strong>{money(order.quote.subtotal)}</strong></p>{order.quote.discount > 0 && <p>Beneficio de ejemplo<strong>−{money(order.quote.discount)}</strong></p>}<p>Entrega<strong>{money(order.quote.fee)}</strong></p><p className="r-total">Total de ejemplo<strong>{money(order.quote.total)} MXN</strong></p></div><p className="r-muted">{order.payment === "digital" ? "Pago digital simulado" : "Pago en el establecimiento · simulado"}{order.paid ? " · Pagado en esta prueba" : " · Pendiente en esta prueba"}</p><p className="r-demo-note">Recibo de demostración. No se realiza un cobro, un envío de correo ni una factura fiscal.</p></div>
}
export default function TrackingPanel({ onClose, onMenu, onProfile }) {
  const { state, dispatch, now } = useRestaurant()
  const reduced = useReducedMotion()
  const { visit, order } = state
  const waiting = visit?.stage === "waiting"
  const count = remainingSeconds(waiting ? visit.deadline : order?.deadline, now)
  const ready = visit?.stage === "seated" && !order
  const point = pointOrDefault(order?.pointId || visit?.pointId || state.pointId)
  const zone = ZONES.find(item => item.id === order?.zoneId)
  const routeProgress = !order || order.status === "preparing" ? 0 : ["delivered", "completed"].includes(order.status) ? 1 : Math.max(0, Math.min(1, (now - order.travelStartedAt) / (order.arrivalDeadline - order.travelStartedAt)))
  const steps = order?.mode === "delivery" ? ["En preparación", "En camino", "Entrega completada"] : ["En preparación", "Pedido listo", "Visita finalizada"]
  const activeStep = order?.status === "preparing" ? 0 : ["ready", "delivering"].includes(order?.status) ? 1 : 2
  return <Modal title={order ? "Sigue tu pedido" : "Tu visita al patio"} onClose={onClose} className="restaurant-modal" radius={4}>
    <p className="r-demo-note">Referencia: {point.name} · {point.city}. Hora del punto: {pointTime(point.id, now)}. No es una sucursal.</p>
    {waiting ? <div className="r-wait-screen"><span className="r-progress">Espera de demostración</span><h3>Estamos preparando tu mesa.</h3><p className="r-big-clock" aria-label={`Tiempo restante: ${count} segundos`}>{formatClock(count)}</p><p className="r-muted">Mientras esperas, puedes explorar la carta y configurar tus platos. Podrás añadirlos cuando la mesa esté lista.</p><button type="button" className="r-button r-full" onClick={onMenu}>Explorar la carta mientras espero</button><button type="button" className="r-text-button r-full" onClick={() => dispatch({ type: "skip-wait" })}>Saltar espera de demostración</button></div> : ready ? <motion.div className="r-table-ready" initial={reduced ? false : { opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}><UtensilsCrossed size={30} aria-hidden="true" /><p className="r-progress">Tu mesa ya te espera</p><h3>Mesa {visit.table}</h3><p className="r-muted">Para {visit.people} {visit.people === 1 ? "persona" : "personas"}. Mesa ficticia asignada entre 1 y 25.</p><button type="button" className="r-button r-full" onClick={() => { dispatch({ type: "acknowledge" }); onMenu() }}>Elegir mi comida</button></motion.div> : order ? <>
      <div className="r-order-status" role="status"><span className="r-result-icon"><Check size={24} aria-hidden="true" /></span><h3>{STATUS_LABELS[order.status]}</h3>{order.deadline && <p className="r-big-clock">{formatClock(count)}</p>}<p className="r-muted">{order.status === "preparing" ? "La cocina de ejemplo está preparando tus platos." : order.status === "delivering" ? "El repartidor ficticio está en camino." : order.status === "ready" ? order.mode === "pickup" ? `Tu turno ${order.turn} está listo para recoger.` : `Tu pedido está listo para la mesa ${order.table}.` : order.status === "delivered" ? "El pedido de ejemplo llegó a su destino." : "Este recorrido terminó. Puedes comenzar otro."}</p></div>
      <ol className="r-tracking-steps" aria-label="Etapas del pedido">{steps.map((label, index) => <li key={label} className={index <= activeStep ? "is-done" : ""} aria-current={index === activeStep ? "step" : undefined}><span>{index < activeStep ? "✓" : index + 1}</span>{label}</li>)}</ol>
      {order.mode === "delivery" && <><div className="r-delivery-summary"><p>{order.address}</p><div className="r-eta-grid"><p>Preparación<strong>20–30 min</strong></p><p>Ruta · {zone.distance} km<strong>{zone.minutes}–{zone.minutes + 5} min</strong></p><p>Total orientativo<strong>{20 + zone.minutes}–{35 + zone.minutes} min</strong></p></div><p>Estimaciones de ejemplo. El pedido conserva su punto y destino al explorar otra ciudad.</p></div><DemoMap pointId={point.id} zone={zone} progress={routeProgress} /></>}
      <p className="r-demo-note">Tiempos acelerados de prueba: 30 segundos de preparación y, para entrega, 10–30 segundos de recorrido. El avance es automático y ficticio. Un servicio real requiere confirmación de cocina y reparto.</p>
      {["preparing", "delivering"].includes(order.status) && <button type="button" className="r-text-button r-full" onClick={() => dispatch({ type: "skip-stage", now: Date.now() })}>Avanzar simulación</button>}
      <details className="r-receipt-details"><summary>Ver recibo y configuración</summary><Receipt order={order} /></details>
      {["ready", "delivered"].includes(order.status) && <button type="button" className="r-button r-full" onClick={() => dispatch({ type: "complete", now: Date.now() })}>{order.mode === "dine" ? "Terminar visita de ejemplo" : order.mode === "pickup" ? "Confirmar recogida de ejemplo" : "Finalizar entrega de ejemplo"}</button>}
      {order.status === "completed" && <><p className="r-muted">{state.profile.member ? "El recibo está en tu perfil de ejemplo. Esta visita cuenta una vez para tus beneficios." : "La sesión de invitado terminó. Su recibo dejará de estar disponible al recargar o iniciar otra visita."}</p><button type="button" className="r-button r-full" onClick={onMenu}>Empezar otra visita</button></>}
      <button type="button" className="r-text-button r-full" onClick={onProfile}>Perfil y recibos de ejemplo</button>
    </> : <><p className="r-muted">{visit ? `${MODES[visit.mode]}: explora la carta y configura tu pedido.` : "Elige cómo quieres comer para iniciar una visita."}</p><button type="button" className="r-button r-full" onClick={onMenu}>Explorar la carta</button></>}
  </Modal>
}

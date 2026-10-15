import { useRef, useState } from "react"
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react"
import Modal from "../../../components/shared/Modal"
import { money } from "../data/menu"
import { configSummary, findProduct, MAX_QUANTITY, MODES, subtotal, unitPrice, ZONES } from "../data/order"
import { useRestaurant } from "../state/context"
import { canOrder, orderQuote, uniqueId } from "../state/model"
export default function OrderFlow({ onClose, onMenu, onEdit, onTracking, onMode, onProfile }) {
  const { state, dispatch, cartDispatch } = useRestaurant()
  const [step, setStep] = useState("cart")
  const [name, setName] = useState("Alex Demo")
  const [zoneId, setZoneId] = useState(ZONES[0].id)
  const [address, setAddress] = useState(ZONES[0].address)
  const [payment, setPayment] = useState("cash")
  const submitted = useRef(false)
  const mode = state.visit?.mode || "pickup"
  const zone = ZONES.find(item => item.id === zoneId)
  const quote = orderQuote(state.cart, mode, zoneId, state.profile)
  const valid = canOrder(state) && state.cart.length > 0 && name.trim().length >= 2 && (mode !== "delivery" || address.trim().length >= 5)
  const submit = () => {
    if (!valid || submitted.current) return
    submitted.current = true
    dispatch({ type: "confirm-order", id: uniqueId("P12"), now: Date.now(), name, zoneId, address, payment })
    onTracking()
  }
  return <Modal title="Tu pedido de ejemplo" onClose={onClose} className="restaurant-modal" radius={4}>
    {state.order ? <><p className="r-muted">Ya tienes un pedido confirmado en esta visita.</p><button type="button" className="r-button r-full" onClick={onTracking}>Ver seguimiento y recibo</button></> : !state.cart.length ? <div className="r-empty"><h3>La mesa empieza por la carta</h3><p>Añade un plato para explorar el pedido. Puedes ajustar cantidades y quitar productos antes de confirmar.</p><button type="button" className="r-button" onClick={onMenu}>Explorar la carta</button></div> : <>
      <p className="r-progress">{step === "cart" ? "1 de 2 · Revisa tus platos" : "2 de 2 · Revisa tu entrega y pago"}</p>
      {step === "cart" ? <><ul className="r-cart-list">{state.cart.map(row => {
        const product = findProduct(row.productId)
        return <li key={row.key}><div className="r-cart-title"><h3>{product.name}</h3><strong>{money(unitPrice(row) * row.quantity)}</strong></div><p className="r-muted">{configSummary(product, row.config).join(" · ") || "Receta original"}</p><div className="r-cart-controls"><div className="r-quantity"><button type="button" aria-label={`Reducir ${product.name}`} disabled={row.quantity <= 1} onClick={() => cartDispatch({ type: "quantity", key: row.key, quantity: row.quantity - 1 })}><Minus size={16} aria-hidden="true" /></button><output aria-label={`Cantidad de ${product.name}`}>{row.quantity}</output><button type="button" aria-label={`Aumentar ${product.name}`} disabled={row.quantity >= MAX_QUANTITY} onClick={() => cartDispatch({ type: "quantity", key: row.key, quantity: row.quantity + 1 })}><Plus size={16} aria-hidden="true" /></button></div><button type="button" className="r-text-button" aria-label={`Editar ${product.name}`} onClick={() => onEdit(row)}>Editar</button><button type="button" className="r-text-button" aria-label={`Quitar ${product.name}`} onClick={() => cartDispatch({ type: "remove", key: row.key })}><Trash2 size={16} aria-hidden="true" /> Quitar</button></div></li>
      })}</ul><p className="r-total">Subtotal<strong>{money(subtotal(state.cart))} MXN</strong></p><button type="button" className="r-button r-full" disabled={!canOrder(state)} onClick={() => setStep("checkout")}>Continuar con el pedido</button><button type="button" className="r-text-button r-full" onClick={onMenu}>Añadir otro plato</button></> : <>
        <p className="r-checkout-mode"><strong>{MODES[mode]}</strong>{state.visit?.table ? ` · Mesa ${state.visit.table}` : ""}<button type="button" className="r-text-button" onClick={onMode}>Cambiar modalidad</button></p>
        <label className="r-field">Nombre de ejemplo<input value={name} maxLength={60} autoComplete="off" onChange={event => setName(event.target.value)} aria-invalid={name.trim().length < 2} aria-describedby="order-fiction" /></label>
        {mode === "delivery" && <><label className="r-field">Zona de entrega de ejemplo<select value={zoneId} onChange={event => { const next = ZONES.find(item => item.id === event.target.value); setZoneId(next.id); setAddress(next.address) }}>{ZONES.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label className="r-field">Dirección de ejemplo<input value={address} maxLength={120} autoComplete="off" onChange={event => setAddress(event.target.value)} aria-invalid={address.trim().length < 5} aria-describedby="order-fiction" /></label><p className="r-delivery-summary">Preparación: 20–30 min de ejemplo. Después, ruta de {zone.minutes}–{zone.minutes + 5} min para {zone.distance} km. Total orientativo: {20 + zone.minutes}–{35 + zone.minutes} min.<br /><small>La zona determina esta estimación ficticia; escribir una dirección no calcula su ubicación real.</small></p></>}
        <p id="order-fiction" className="r-demo-note">Conserva los ejemplos o usa únicamente datos ficticios. El pedido activo se guarda en este navegador durante la prueba.</p>
        <fieldset className="r-options"><legend>Pago de demostración</legend><label className="r-option"><input type="radio" name="payment" checked={payment === "cash"} onChange={() => setPayment("cash")} /><span>Pagar al recibir · simulado</span></label><label className="r-option"><input type="radio" name="payment" checked={payment === "digital"} onChange={() => setPayment("digital")} /><span>Pago digital · simulado<br /><small>Sin introducir tarjeta ni realizar cobros.</small></span></label></fieldset>
        <button type="button" className="r-text-button" onClick={onProfile}>{state.profile.member ? "Revisar mis beneficios" : "Probar perfil y beneficios"}</button>
        <div className="r-price-summary"><p>Platos<strong>{money(quote.subtotal)}</strong></p>{quote.discount > 0 && <p>Beneficio de ejemplo<strong>−{money(quote.discount)}</strong></p>}<p>Entrega<strong>{money(quote.fee)}</strong></p><p className="r-total">Total de ejemplo<strong>{money(quote.total)} MXN</strong></p></div>
        <button type="button" className="r-button r-full" disabled={!valid} onClick={submit}>Simular pedido · {money(quote.total)}</button><button type="button" className="r-text-button r-full" onClick={() => setStep("cart")}><ArrowLeft size={16} aria-hidden="true" /> Volver a los platos</button>
      </>}
    </>}
  </Modal>
}

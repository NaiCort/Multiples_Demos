import { useEffect, useRef, useState } from "react"
import { ArrowLeft, Check, Minus, Plus, Trash2 } from "lucide-react"
import Modal from "../../../components/shared/Modal"
import { money } from "../data/menu"
import { DELIVERY_FEE, findProduct, MAX_QUANTITY, subtotal, unitPrice } from "../data/order"

export default function OrderFlow({ cart, dispatch, onClose, onMenu }) {
  const [step, setStep] = useState("cart")
  const [mode, setMode] = useState("pickup")
  const [name, setName] = useState("Alex Demo")
  const [address, setAddress] = useState("Calle de ejemplo 10")
  const [receipt, setReceipt] = useState(null)
  const timer = useRef(null)
  const heading = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => { heading.current?.focus({ preventScroll: true }) }, [step])
  const fee = mode === "delivery" ? DELIVERY_FEE : 0
  const total = subtotal(cart) + fee
  const submit = () => {
    if (!cart.length || name.trim().length < 2 || (mode === "delivery" && address.trim().length < 5)) return
    setReceipt({ rows: cart.map(row => ({ ...row, extras: [...row.extras] })), mode, name: name.trim(), address: address.trim(), fee, total })
    setStep("processing")
    timer.current = setTimeout(() => { setStep("done"); dispatch({ type: "clear" }) }, 800)
  }
  return <Modal title="Tu pedido de ejemplo" onClose={onClose} className="restaurant-modal" fontFamily="'Patio Sans', sans-serif" radius={4}>
    {step === "done" ? <div className="r-result">
      <span className="r-result-icon"><Check size={28} aria-hidden="true" /></span>
      <h3 ref={heading} tabIndex={-1}>Pedido simulado completado</h3>
      <p>Referencia de ejemplo: <strong>PATIO-DEMO-012</strong></p>
      <ul className="r-receipt">{receipt.rows.map(row => <li key={row.key}>{row.quantity} × {findProduct(row.productId).name}<span>{money(row.quantity * unitPrice(row))}</span></li>)}</ul>
      <p>{receipt.mode === "pickup" ? "Para recoger · 25–35 min de ejemplo" : `Entrega de ejemplo · ${receipt.address}`}</p>
      <p className="r-total">Total de ejemplo <strong>{money(receipt.total)} MXN</strong></p>
      <p className="r-demo-note">No se realizó un cobro ni se envió el pedido. No hay una cocina ni un repartidor atendiendo esta demostración.</p>
      <button type="button" className="r-button r-full" onClick={onMenu}>Empezar otro pedido</button>
      <button type="button" className="r-text-button r-full" onClick={onClose}>Finalizar</button>
    </div> : step === "processing" ? <div className="r-processing" role="status" aria-live="polite"><span className="r-spinner" aria-hidden="true" /><h3 ref={heading} tabIndex={-1}>Simulando pedido…</h3><p>Sin cobros ni envíos reales.</p></div> : !cart.length ? <div className="r-empty"><h3 ref={heading} tabIndex={-1}>La mesa empieza por la carta</h3><p>Añade un plato para explorar el pedido. Puedes ajustar cantidades y quitar productos antes de confirmar.</p><button type="button" className="r-button" onClick={onMenu}>Explorar la carta</button></div> : <>
      <p className="r-progress">{step === "cart" ? "1 de 2 · Revisa tus platos" : "2 de 2 · Elige cómo recibirlos"}</p>
      {step === "cart" ? <>
        <ul className="r-cart-list">{cart.map(row => {
          const product = findProduct(row.productId)
          return <li key={row.key}><div className="r-cart-title"><h3>{product.name}</h3><strong>{money(unitPrice(row) * row.quantity)}</strong></div>
            {row.extras.length > 0 && <p className="r-muted">{product.extras.filter(extra => row.extras.includes(extra.id)).map(extra => extra.name).join(", ")}</p>}
            <div className="r-cart-controls"><div className="r-quantity">
              <button type="button" aria-label={`Reducir ${product.name}`} disabled={row.quantity <= 1} onClick={() => dispatch({ type: "quantity", key: row.key, quantity: row.quantity - 1 })}><Minus size={16} aria-hidden="true" /></button>
              <output aria-label={`Cantidad de ${product.name}`}>{row.quantity}</output>
              <button type="button" aria-label={`Aumentar ${product.name}`} disabled={row.quantity >= MAX_QUANTITY} onClick={() => dispatch({ type: "quantity", key: row.key, quantity: row.quantity + 1 })}><Plus size={16} aria-hidden="true" /></button>
            </div><button type="button" className="r-text-button" aria-label={`Quitar ${product.name}`} onClick={() => dispatch({ type: "remove", key: row.key })}><Trash2 size={16} aria-hidden="true" /> Quitar</button></div>
          </li>
        })}</ul>
        <p className="r-total">Subtotal <strong>{money(subtotal(cart))} MXN</strong></p>
        <p className="r-demo-note">Precios finales de ejemplo. La entrega simulada, si la eliges, cuesta {money(DELIVERY_FEE)} adicionales.</p>
        <button type="button" className="r-button r-full" onClick={() => setStep("checkout")}>Continuar con el pedido</button>
        <button type="button" className="r-text-button r-full" onClick={onMenu}>Añadir otro plato</button>
      </> : <>
        <h3 ref={heading} tabIndex={-1} className="r-sr-only">Cómo recibir el pedido</h3>
        <fieldset className="r-options"><legend>Modalidad</legend>
          <label className="r-option"><input type="radio" name="order-mode" checked={mode === "pickup"} onChange={() => setMode("pickup")} /><span>Para recoger<br /><small>25–35 min de ejemplo</small></span><strong>Sin costo</strong></label>
          <label className="r-option"><input type="radio" name="order-mode" checked={mode === "delivery"} onChange={() => setMode("delivery")} /><span>Entrega simulada<br /><small>40–50 min de ejemplo</small></span><strong>{money(DELIVERY_FEE)}</strong></label>
        </fieldset>
        <label className="r-field">Nombre de ejemplo<input value={name} maxLength={60} autoComplete="off" onChange={event => setName(event.target.value)} aria-invalid={name.trim().length < 2} aria-describedby={`order-fiction${name.trim().length < 2 ? " order-name-error" : ""}`} /></label>
        {name.trim().length < 2 && <p id="order-name-error" className="r-error">Escribe un nombre ficticio de al menos dos caracteres.</p>}
        {mode === "delivery" && <><label className="r-field">Dirección de ejemplo<input value={address} maxLength={120} autoComplete="off" onChange={event => setAddress(event.target.value)} aria-invalid={address.trim().length < 5} aria-describedby={`order-fiction${address.trim().length < 5 ? " order-address-error" : ""}`} /></label>{address.trim().length < 5 && <p id="order-address-error" className="r-error">Escribe una dirección ficticia de al menos cinco caracteres.</p>}</>}
        <p id="order-fiction" className="r-demo-note">Usa únicamente datos ficticios. Puedes conservar los ejemplos ya escritos.</p>
        <div className="r-price-summary"><p>Platos <strong>{money(subtotal(cart))}</strong></p><p>Entrega <strong>{money(fee)}</strong></p><p className="r-total">Total de ejemplo <strong>{money(total)} MXN</strong></p></div>
        <button type="button" className="r-button r-full" disabled={name.trim().length < 2 || (mode === "delivery" && address.trim().length < 5)} onClick={submit}>Simular pedido · {money(total)}</button>
        <button type="button" className="r-text-button r-full" onClick={() => setStep("cart")}><ArrowLeft size={16} aria-hidden="true" /> Volver a los platos</button>
      </>}
    </>}
  </Modal>
}

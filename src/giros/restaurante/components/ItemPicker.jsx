import { useState } from "react"
import { Minus, Plus } from "lucide-react"
import Modal from "../../../components/shared/Modal"
import { money } from "../data/menu"
import { lineKey, MAX_QUANTITY } from "../data/order"

export default function ItemPicker({ product, cart, onAdd, onClose }) {
  const [quantity, setQuantity] = useState(1)
  const [extras, setExtras] = useState([])
  const existing = cart.find(row => row.key === lineKey(product.id, extras))?.quantity || 0
  const remaining = MAX_QUANTITY - existing
  const price = product.price + product.extras.filter(extra => extras.includes(extra.id)).reduce((sum, extra) => sum + extra.price, 0)
  return <Modal title={product.name} onClose={onClose} className="restaurant-modal" fontFamily="'Patio Sans', sans-serif" radius={4}>
    <p className="r-muted">{product.description}</p>
    <p className="r-allergens"><strong>Alérgenos de ejemplo:</strong> {product.allergens}. Consulta al negocio antes de realizar un pedido real.</p>
    {product.extras.length > 0 && <fieldset className="r-options"><legend>Hazlo a tu gusto</legend>
      {product.extras.map(extra => <label key={extra.id} className="r-option">
        <input type="checkbox" checked={extras.includes(extra.id)} onChange={() => setExtras(current => current.includes(extra.id) ? current.filter(id => id !== extra.id) : [...current, extra.id])} />
        <span>{extra.name}</span><strong>+{money(extra.price)}</strong>
      </label>)}
    </fieldset>}
    <div className="r-quantity-row"><span>Cantidad</span><div className="r-quantity">
      <button type="button" aria-label="Reducir cantidad" disabled={quantity <= 1} onClick={() => setQuantity(value => value - 1)}><Minus size={16} aria-hidden="true" /></button>
      <output aria-label="Cantidad elegida">{quantity}</output>
      <button type="button" aria-label="Aumentar cantidad" disabled={quantity >= MAX_QUANTITY} onClick={() => setQuantity(value => value + 1)}><Plus size={16} aria-hidden="true" /></button>
    </div></div>
    {quantity > remaining && <p className="r-error" role="status">Máximo {MAX_QUANTITY} unidades de cada combinación. Ya tienes {existing} en el pedido; reduce la cantidad o modifica el pedido.</p>}
    <p className="r-demo-note">Producto y precio de ejemplo. No se cobra ni se envía un pedido real.</p>
    <button type="button" className="r-button r-full" disabled={quantity > remaining} onClick={() => onAdd({ type: "add", productId: product.id, extras, quantity })}>Añadir al pedido · {money(price * quantity)}</button>
  </Modal>
}

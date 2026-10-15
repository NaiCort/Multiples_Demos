import { useState } from "react"
import { Minus, Plus } from "lucide-react"
import Modal from "../../../components/shared/Modal"
import { money } from "../data/menu"
import { allergens, cleanConfig, dietLabel, dietaryTag, LEVELS, lineKey, MAX_QUANTITY, nutrition, unitPrice } from "../data/order"
import PhotoGallery from "./PhotoGallery"
export default function ItemPicker({ product, cart, onAdd, onClose, editing = null, allowed = true, blockedReason = null, onWait }) {
  const [quantity, setQuantity] = useState(editing?.quantity || 1)
  const [config, setConfig] = useState(() => cleanConfig(product, editing?.config))
  const existing = cart.find(row => row.key !== editing?.key && row.key === lineKey(product.id, config))?.quantity || 0
  const price = unitPrice({ productId: product.id, config })
  const nutrients = nutrition(product, config)
  const setAmount = (id, value) => setConfig(current => ({ ...current, amounts: { ...current.amounts, [id]: value } }))
  return <Modal title={product.name} onClose={onClose} className="restaurant-modal" fontFamily="'Patio Sans', sans-serif" radius={4}>
    <PhotoGallery product={product} />
    <p className="r-muted">{product.description}</p><p className="r-demo-note">{product.portion}. Fotografías de referencia; la receta de ejemplo puede variar de la presentación.</p>
    <span className="r-menu-tag">{dietLabel(dietaryTag(product, config))}</span>
    <details className="r-nutrition"><summary>Ingredientes y nutrientes de ejemplo</summary><p>{product.ingredients.map(item => `${item.name} (${item.portion})`).join(" · ")}</p><dl>{[["kcal", "Energía", "kcal"], ["protein", "Proteína", "g"], ["carbs", "Carbohidratos", "g"], ["fat", "Grasas", "g"], ["fiber", "Fibra", "g"], ["sodium", "Sodio", "mg"]].map(([key, label, unit]) => <div key={key}><dt>{label}</dt><dd>{nutrients[key]} {unit}</dd></div>)}</dl><p className="r-demo-note">Cifras ficticias por porción configurada. Cambian con los ingredientes; no sirven para decisiones médicas o dietéticas. “Aparte” conserva la cantidad de ejemplo.</p></details>
    <p className="r-allergens"><strong>Alérgenos declarados de ejemplo:</strong> {allergens(product, config)}. Quitar un ingrediente no elimina el riesgo de contacto cruzado. Consulta a la cocina en un pedido real.</p>
    <fieldset className="r-options"><legend>Ajusta tu plato</legend>{product.ingredients.map(item => item.adjustable ? <label className="r-modifier" key={item.id}><span>{item.name}<small>{item.portion} de ejemplo</small></span><select aria-label={`Cantidad de ${item.name}`} value={config.amounts[item.id] || "normal"} onChange={event => setAmount(item.id, event.target.value)}>{LEVELS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label> : <p className="r-fixed-ingredient" key={item.id}>{item.name} <small>· Parte de la receta base</small></p>)}</fieldset>
    {(product.swaps || []).map(group => <label className="r-field" key={group.id}>{group.name}<select value={config.swaps[group.id] || "base"} onChange={event => setConfig(current => ({ ...current, swaps: { ...current.swaps, [group.id]: event.target.value } }))}><option value="base">Receta original</option>{group.options.map(option => <option key={option.id} value={option.id}>{option.name}{option.price ? ` · +${money(option.price)}` : " · sin costo"}</option>)}</select></label>)}
    {product.extras.length > 0 && <fieldset className="r-options"><legend>Añade algo más</legend>{product.extras.map(extra => <label key={extra.id} className="r-option">{extra.image && <img className="r-extra-photo" src={`/restaurante/${extra.image}.webp`} loading="lazy" width="64" height="64" alt="" />}<input type="checkbox" checked={config.extras.includes(extra.id)} onChange={() => setConfig(current => ({ ...current, extras: current.extras.includes(extra.id) ? current.extras.filter(id => id !== extra.id) : [...current.extras, extra.id] }))} /><span>{extra.name}</span><strong>+{money(extra.price)}</strong></label>)}</fieldset>}
    <p className="r-demo-note">Reducir o quitar ingredientes no cambia el precio base. Los extras y las sustituciones con costo se suman al total.</p>
    <div className="r-quantity-row"><span>Cantidad</span><div className="r-quantity"><button type="button" aria-label="Reducir cantidad" disabled={quantity <= 1} onClick={() => setQuantity(value => value - 1)}><Minus size={16} aria-hidden="true" /></button><output aria-label="Cantidad elegida">{quantity}</output><button type="button" aria-label="Aumentar cantidad" disabled={quantity >= MAX_QUANTITY} onClick={() => setQuantity(value => value + 1)}><Plus size={16} aria-hidden="true" /></button></div></div>
    {quantity + existing > MAX_QUANTITY && <p className="r-error" role="status">Máximo {MAX_QUANTITY} unidades de cada combinación. Ya tienes {existing} en el pedido.</p>}
    {!allowed && <div className="r-wait-notice"><p>{blockedReason || "Puedes explorar y configurar el plato. Cuando tu mesa esté lista podrás añadirlo."}</p><button type="button" className="r-text-button" onClick={onWait}>{blockedReason ? "Ver mi pedido" : "Ver mi espera"}</button></div>}
    <button type="button" className="r-button r-full" disabled={!allowed || quantity + existing > MAX_QUANTITY} onClick={() => onAdd({ type: editing ? "edit" : "add", key: editing?.key, productId: product.id, config, quantity })}>{editing ? "Guardar cambios" : "Añadir al pedido"} · {money(price * quantity)}</button>
  </Modal>
}

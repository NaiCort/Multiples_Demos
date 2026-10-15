import { Link, useSearchParams } from "react-router-dom"
import { ArrowUpRight, Search } from "lucide-react"
import { CATEGORIES, DIETS, MENU, money, normalizeSearch } from "../data/menu"
import { dietLabel, dietaryTag, nutrition } from "../data/order"
import { localLabel } from "../data/locations"
import { useRestaurant } from "../state/context"
import PhotoGallery from "../components/PhotoGallery"

export default function Carta({ onChoose }) {
  const { state } = useRestaurant()
  const [params, setParams] = useSearchParams()
  const category = CATEGORIES.includes(params.get("categoria")) ? params.get("categoria") : "Todo"
  const diet = DIETS.some(([id]) => id === params.get("preferencia")) ? params.get("preferencia") : "all"
  const search = params.get("buscar") || ""
  const query = normalizeSearch(search)
  const update = (key, value, fallback = "") => setParams(current => { const next = new URLSearchParams(current); if (value === fallback || !value) next.delete(key); else next.set(key, value); return next }, { replace: true })
  const filtered = MENU.filter(item => (category === "Todo" || item.category === category) && (diet === "all" || dietaryTag(item) === diet || diet === "vegetarian" && dietaryTag(item) === "vegan") && normalizeSearch(`${item.name} ${item.description} ${item.ingredients.map(ingredient => ingredient.name).join(" ")}`).includes(query))
  return <section className="r-menu-section r-carta-page" id="carta"><div className="r-section-head"><div><p className="r-kicker">LA COCINA DEL PATIO</p><h1 tabIndex={-1}>La carta,<br />sin vueltas.</h1></div><p>Local simulado: {localLabel(state.pointId)}.<br />Precios de ejemplo en MXN. Misma carta en todos los locales.</p></div>
    <div className="r-menu-tools"><div className="r-category-list" role="group" aria-label="Filtrar carta por categoría">{CATEGORIES.map(label => <button type="button" key={label} aria-pressed={category === label} onClick={() => update("categoria", label, "Todo")}>{label}</button>)}</div><label className="r-diet-filter">Preferencia<select aria-label="Preferencia" value={diet} onChange={event => update("preferencia", event.target.value, "all")}>{DIETS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label className="r-search"><Search size={18} aria-hidden="true" /><span className="r-sr-only">Buscar en la carta</span><input type="search" placeholder="¿Qué se te antoja?" value={search} onChange={event => update("buscar", event.target.value)} /></label></div>
    <p className="r-menu-count" role="status">{filtered.length} {filtered.length === 1 ? "opción" : "opciones"}{category !== "Todo" ? ` · ${category}` : ""}{search ? ` · búsqueda: ${search}` : ""}</p>
    {filtered.length ? <div className="r-menu-list">{filtered.map((item, index) => { const info = nutrition(item); return <article key={item.id} className="r-menu-item"><PhotoGallery product={item} compact /><div className="r-item-copy"><div className="r-item-title"><h2><span className="r-menu-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{item.name}</h2><strong>{money(item.price)}</strong></div><p>{item.description}</p><p className="r-card-nutrients">{info.protein} g proteína · {info.carbs} g carbohidratos · {info.fat} g grasas · {info.kcal} kcal de ejemplo</p><span className="r-menu-tag">{dietLabel(dietaryTag(item))}</span><button type="button" className="r-text-button" aria-label={`Elegir ${item.name}`} onClick={() => onChoose(item)}>Ver y personalizar <ArrowUpRight size={16} aria-hidden="true" /></button></div></article> })}</div> : <div className="r-empty-search"><h2>No encontramos ese antojo.</h2><p>Prueba con “pasta”, “pollo” o una categoría diferente.</p><button type="button" className="r-secondary-button" onClick={() => setParams({}, { replace: true })}>Ver toda la carta</button></div>}
    <div className="r-menu-foot"><p>Ingredientes, nutrientes y alérgenos ficticios. Los filtros describen la receta base; los cambios se detallan en cada producto.</p><Link to="/restaurante/pedido" className="r-text-button">Revisar mi pedido <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
  </section>
}

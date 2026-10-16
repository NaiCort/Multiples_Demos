import { useRef } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { ArrowUpRight, Search, MapPin } from "lucide-react"
import { CATEGORIES, DIETS, categoryFromParam, menuForPoint, money, normalizeSearch } from "../data/menu"
import { dietLabel, dietaryTag, nutrition } from "../data/order"
import { localLabel } from "../data/locations"
import { useRestaurant } from "../state/context"
import PhotoGallery from "../components/PhotoGallery"

export default function Carta({ onChoose, onChangeLocal }) {
  const { state } = useRestaurant()
  const [params, setParams] = useSearchParams()
  const searchInput = useRef(null), content = useRef(null)
  const category = categoryFromParam(params.get("categoria"))
  const diet = DIETS.some(([id]) => id === params.get("preferencia")) ? params.get("preferencia") : "all"
  const search = params.get("buscar") || ""
  const query = normalizeSearch(search)
  const menu = menuForPoint(state.pointId)
  const update = (key, value, fallback = "", replace = true) => setParams(current => { const next = new URLSearchParams(current); if (value === fallback || !value) next.delete(key); else next.set(key, value); return next }, { replace })
  const changeCategory = value => { update("categoria", value, "Todo", false); content.current?.scrollIntoView({ block: "start", behavior: "instant" }) }
  const filtered = menu.filter(item => (category === "Todo" || item.category === category) && (diet === "all" || dietaryTag(item) === diet || diet === "vegetarian" && dietaryTag(item) === "vegan") && normalizeSearch(`${item.name} ${item.description} ${item.ingredients.map(ingredient => ingredient.name).join(" ")}`).includes(query))
  const groups = CATEGORIES.slice(1).map(label => ({ label, products: filtered.filter(item => item.category === label) })).filter(group => group.products.length)
  const categoryCount = label => label === "Todo" ? menu.length : menu.filter(item => item.category === label).length
  // Escribir o mover el reloj no remonta los controles ni reinicia sus fotografías.
  const resultKey = `${state.pointId}-${filtered.map(item => item.id).join("-") || "empty"}`
  return <section className="r-menu-section r-carta-page" id="carta">
    <div className="r-section-head"><div><p className="r-kicker">LA COCINA DEL PATIO</p><h1 tabIndex={-1}>La carta,<br />sin vueltas.</h1></div><p>Desde el desayuno hasta la sobremesa.<br />Precios de ejemplo en MXN en ambos países.</p></div>
    <div className="r-carta-local"><MapPin size={20} aria-hidden="true" /><p><strong>Carta de {localLabel(state.pointId)}</strong><span>Una base común y un sabor propio de este local simulado.</span></p><button type="button" className="r-text-button" onClick={onChangeLocal}>Cambiar local de la carta <ArrowUpRight size={16} aria-hidden="true" /></button></div>
    <div className="r-browse-layout">
      <aside className="r-browse-sidebar r-carta-sidebar" aria-label="Categorías de la carta">
        <div className="r-sidebar-desktop"><p className="r-sidebar-title">PARA CADA ANTOJO</p><h2>Categorías</h2><div className="r-category-list" role="group" aria-label="Filtrar carta por categoría">{CATEGORIES.map(label => <button type="button" key={label} aria-label={label} aria-pressed={category === label} onClick={() => changeCategory(label)}><span>{label}</span><span className="r-category-count" aria-hidden="true">{categoryCount(label)}</span></button>)}</div></div>
        <label className="r-sidebar-mobile r-field">Categoría de la carta<select aria-label="Categoría de la carta" value={category} onChange={event => changeCategory(event.target.value)}>{CATEGORIES.map(label => <option key={label} value={label}>{label} · {categoryCount(label)}</option>)}</select></label>
        <p className="r-sidebar-note">«Sabores de la región» cambia con el local. Las recetas y sus cifras son de demostración.</p>
      </aside>
      <div ref={content} className="r-browse-content r-carta-content">
        <div className="r-menu-tools"><label className="r-search"><Search size={18} aria-hidden="true" /><span className="r-sr-only">Buscar en la carta</span><input ref={searchInput} type="search" placeholder="¿Qué se te antoja?" value={search} onChange={event => update("buscar", event.target.value)} /></label><label className="r-diet-filter">Preferencia<select aria-label="Preferencia" value={diet} onChange={event => update("preferencia", event.target.value, "all")}>{DIETS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div>
        <p className="r-menu-count" role="status">{filtered.length} {filtered.length === 1 ? "opción" : "opciones"}{category !== "Todo" ? ` · ${category}` : ""}{search ? ` · búsqueda: ${search}` : ""} · {localLabel(state.pointId)}</p>
        <div key={resultKey} className="r-menu-results">{filtered.length ? <div className="r-menu-list">{groups.map(group => <section key={group.label} className="r-menu-group" aria-labelledby={`categoria-${CATEGORIES.indexOf(group.label)}`}>
          <div className="r-menu-group-head"><h2 id={`categoria-${CATEGORIES.indexOf(group.label)}`}>{group.label}</h2><span>{group.products.length} {group.products.length === 1 ? "opción" : "opciones"}</span></div>
          {group.label === "Sabores de la región" && <p className="r-region-intro">Una propuesta para {localLabel(state.pointId)}. Cambia de local para descubrir otra especialidad; la carta común se conserva.</p>}
          {group.label === "Vinos, cervezas y cocteles" && <p className="r-region-intro">Selección ficticia de bebidas con alcohol. Aquí no se vende ni se sirve alcohol.</p>}
          <div className="r-dish-grid">{group.products.map(item => { const info = nutrition(item); return <article key={item.id} className="r-menu-item" data-product={item.id}>
            <PhotoGallery product={item} compact />
            <div className="r-item-copy"><div className="r-item-title"><h3>{item.name}</h3><strong>{money(item.price)}</strong></div><p>{item.description}</p><p className="r-card-nutrients">{info.protein} g proteína · {info.carbs} g carbohidratos · {info.fat} g grasas · {info.kcal} kcal de ejemplo</p><span className="r-menu-tag">{dietLabel(dietaryTag(item))}</span>{item.pointIds && <span className="r-menu-tag r-region-tag">Solo en este local</span>}<button type="button" className="r-text-button" aria-label={`Elegir ${item.name}`} onClick={() => onChoose(item)}>Ver y personalizar <ArrowUpRight size={16} aria-hidden="true" /></button></div>
          </article> })}</div>
        </section>)}</div> : <div className="r-empty-search"><h2>No encontramos ese antojo.</h2><p>Prueba con “pasta”, “pollo” o una categoría diferente.</p><button type="button" className="r-secondary-button" onClick={() => { setParams({}, { replace: true }); searchInput.current?.focus({ preventScroll: true }) }}>Ver toda la carta</button></div>}</div>
      </div>
    </div>
    <div className="r-menu-foot"><p>Ingredientes, nutrientes y alérgenos ficticios. Los filtros describen la receta base; los cambios se detallan en cada producto. Las fotos ilustran el plato base y no cambian con los ingredientes.</p><Link to="/restaurante/pedido" className="r-text-button">Revisar mi pedido <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
  </section>
}

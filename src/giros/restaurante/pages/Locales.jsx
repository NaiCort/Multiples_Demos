import { useCallback, useRef, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { LocateFixed, ArrowUpRight, Globe2 } from "lucide-react"
import { COUNTRIES, STATES, localLabel, locationFilters, POINTS, pointsInArea, pointOrDefault } from "../data/locations"
import { useRestaurant } from "../state/context"
import useNearbyLocal from "../hooks/useNearbyLocal"
import DemoMap from "../components/DemoMap"
import LocationCard from "../components/LocationCard"

export default function Locales({ onLocalOrder, onLocalReserve }) {
  const { state } = useRestaurant()
  const [params, setParams] = useSearchParams()
  const filters = locationFilters(params)
  const { country, state: stateId, city } = filters
  const [viewedId, setViewedId] = useState(state.pointId)
  const [focusToken, setFocusToken] = useState(0)
  const mapBlock = useRef(null), list = useRef(null)
  const visible = pointsInArea(filters)
  const point = visible.find(item => item.id === viewedId) || visible[0] || pointOrDefault(state.pointId)
  const onMap = useCallback(id => { setViewedId(id); setFocusToken(value => value + 1) }, [])
  const setArea = (next, scroll = true) => {
    const query = new URLSearchParams()
    if (next.country) query.set("pais", next.country)
    if (next.state) query.set("estado", next.state)
    if (next.city) query.set("ciudad", next.city)
    setParams(query)
    setViewedId(pointsInArea(next)[0]?.id || state.pointId); setFocusToken(value => value + 1)
    if (scroll) list.current?.scrollIntoView({ block: "start", behavior: "instant" })
  }
  const nearby = useNearbyLocal(id => { setParams({}); onMap(id); mapBlock.current?.scrollIntoView({ block: "start", behavior: "instant" }) })
  const selectedCountry = COUNTRIES.find(item => item.id === country)
  const selectedState = STATES.find(item => item.id === stateId)
  const heading = city || selectedState?.name || selectedCountry?.name || "Todos los locales"
  return <section className="r-locations-page r-page-section">
    <div className="r-section-head"><div><p className="r-kicker">NUESTROS LOCALES · DEMOSTRACIÓN</p><h1 tabIndex={-1}>Encuentra tu<br />próximo patio.</h1></div><p>{POINTS.length} locales simulados en dos países.<br />Tu selección actual: {localLabel(state.pointId)}.</p></div>
    <p className="r-section-intro">De México a Estados Unidos. Explora por país y estado; cada parque o plaza es una referencia real para un restaurante ficticio.</p>
    <div className="r-browse-layout">
      <aside className="r-browse-sidebar r-locations-sidebar" aria-label="Países y estados de los locales">
        <div className="r-sidebar-desktop"><p className="r-sidebar-title">UN PATIO CERCA</p><h2>Países y estados</h2><nav className="r-geo-nav" aria-label="Filtrar locales por país y estado">
          <button type="button" aria-label="Todos los países" aria-pressed={!country} onClick={() => setArea({})}><Globe2 size={17} aria-hidden="true" /><span>Todos los países</span><span aria-hidden="true">{POINTS.length}</span></button>
          <div className="r-country-choices">{COUNTRIES.map(item => <button key={item.id} type="button" className="r-country-button" aria-label={item.name} aria-pressed={country === item.id} onClick={() => setArea({ country: item.id })}><span>{item.name}</span><span aria-hidden="true">{pointsInArea({ country: item.id }).length}</span></button>)}</div>
          {COUNTRIES.filter(item => !country || item.id === country).map(item => <div key={item.id} className="r-geo-country"><p className="r-sidebar-subheading">Estados de {item.name}</p><ul>{STATES.filter(area => area.countryCode === item.id).map(area => <li key={area.id}><button type="button" aria-label={`${area.name}, ${item.name}`} aria-pressed={stateId === area.id} onClick={() => setArea({ country: item.id, state: area.id })}><span>{area.name}</span><span aria-hidden="true">{pointsInArea({ state: area.id }).length}</span></button></li>)}</ul></div>)}
        </nav></div>
        <div className="r-sidebar-mobile r-geo-mobile"><label className="r-field">País<select aria-label="País de los locales" value={country} onChange={event => setArea({ country: event.target.value })}><option value="">Todos los países</option>{COUNTRIES.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label className="r-field">Estado<select aria-label="Estado de los locales" value={stateId} onChange={event => { const area = STATES.find(item => item.id === event.target.value); setArea({ country: area?.countryCode || country, state: area?.id || "" }) }}><option value="">Todos los estados</option>{COUNTRIES.filter(item => !country || item.id === country).map(item => <optgroup key={item.id} label={item.name}>{STATES.filter(area => area.countryCode === item.id).map(area => <option key={area.id} value={area.id}>{area.name}</option>)}</optgroup>)}</select></label></div>
        <p className="r-sidebar-note">Elegir una zona filtra el mapa y la lista. Tu pedido conserva su local hasta que tú lo cambies.</p>
      </aside>
      <div className="r-browse-content">
        <div className="r-locals-tools"><label className="r-field">Filtrar locales por ciudad<select aria-label="Filtrar locales por ciudad" value={city} onChange={event => setArea({ country, state: stateId, city: event.target.value }, false)}><option value="">Todas las ciudades</option>{[...new Set(pointsInArea({ country, state: stateId }).map(item => item.city))].map(label => <option key={label} value={label}>{label}</option>)}</select></label><button type="button" className="r-secondary-button" disabled={nearby.busy} onClick={nearby.locate}><LocateFixed size={17} aria-hidden="true" />{nearby.busy ? "Buscando…" : "Usar mi ubicación"}</button></div>
        <p role="status" className="r-demo-note">{nearby.message || "La ubicación es opcional: solo se solicita permiso al pulsar el botón. Puedes elegir manualmente."}</p>
        <div ref={mapBlock} className="r-locals-map"><DemoMap pointId={state.pointId} overview cityFilter={city} countryFilter={country} stateFilter={stateId} selectedId={point.id} focusToken={focusToken} onSelectPoint={onMap} /></div>
        <div className="r-map-selection"><p role="status"><strong>En el mapa: {localLabel(point.id)}</strong><span>Referencia: {point.name}. Explorar no cambia el local de tu pedido.</span></p><Link to={`/restaurante/locales/${point.id}`} className="r-text-button">Ver ficha del local <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
        <div ref={list} id="lista-de-locales" className="r-locals-directory"><div className="r-section-head r-locals-list-head"><h2>{heading}.</h2><p role="status">{visible.length} {visible.length === 1 ? "local simulado" : "locales simulados"}</p>{(country || city) && <button type="button" className="r-text-button" onClick={() => setArea({})}>Ver todos los locales</button>}</div>
          {COUNTRIES.map(item => { const byCountry = visible.filter(point => point.countryCode === item.id); return byCountry.length ? <section key={item.id} className="r-country-group" aria-labelledby={`pais-${item.id}`}><p className="r-directory-country" id={`pais-${item.id}`}>{item.name}</p>{STATES.filter(area => area.countryCode === item.id).map(area => { const locals = byCountry.filter(point => point.stateId === area.id); return locals.length ? <section key={area.id} className="r-state-group" aria-labelledby={`estado-${area.id}`}><h3 id={`estado-${area.id}`}>{area.name}<span>{locals.length} {locals.length === 1 ? "local" : "locales"}</span></h3><div className="r-locals-grid r-locals-directory-list">{locals.map(item => <LocationCard key={item.id} point={item} index={POINTS.indexOf(item)} directory selected={state.pointId === item.id} viewed={point.id === item.id} onOrder={onLocalOrder} onReserve={onLocalReserve} onMap={id => { onMap(id); mapBlock.current?.scrollIntoView({ block: "start", behavior: "instant" }) }} />)}</div></section> : null })}</section> : null })}
        </div>
      </div>
    </div>
  </section>
}

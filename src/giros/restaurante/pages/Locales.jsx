import { useCallback, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { LocateFixed, ArrowUpRight } from "lucide-react"
import { localLabel, POINTS, pointOrDefault } from "../data/locations"
import { useRestaurant } from "../state/context"
import useNearbyLocal from "../hooks/useNearbyLocal"
import DemoMap from "../components/DemoMap"
import LocationCard from "../components/LocationCard"

export default function Locales({ onLocalOrder, onLocalReserve }) {
  const { state } = useRestaurant()
  const [city, setCity] = useState("")
  const [viewedId, setViewedId] = useState(state.pointId)
  const [focusToken, setFocusToken] = useState(0)
  const mapBlock = useRef(null)
  const point = pointOrDefault(viewedId)
  const visible = POINTS.filter(item => !city || item.city === city)
  const onMap = useCallback(id => { setViewedId(id); setFocusToken(value => value + 1) }, [])
  const nearby = useNearbyLocal(id => { setCity(""); onMap(id) })
  return <section className="r-locations-page r-page-section"><div className="r-section-head"><div><p className="r-kicker">NUESTROS LOCALES · DEMOSTRACIÓN</p><h1 tabIndex={-1}>Encuentra tu<br />próximo patio.</h1></div><p>Ocho locales simulados, siete ciudades.<br />Tu selección actual: {localLabel(state.pointId)}.</p></div>
    <p className="r-section-intro">Explora el mapa y las fichas de cada local. Los parques y plazas son referencias reales; los restaurantes de Patio 12 son ficticios.</p>
    <div className="r-locals-tools"><label className="r-field">Filtrar locales por ciudad<select aria-label="Filtrar locales por ciudad" value={city} onChange={event => { const next = event.target.value; setCity(next); if (next) setViewedId(POINTS.find(item => item.city === next).id); setFocusToken(value => value + 1) }}><option value="">Todas las ciudades</option>{[...new Set(POINTS.map(item => item.city))].map(label => <option key={label} value={label}>{label}</option>)}</select></label><button type="button" className="r-secondary-button" disabled={nearby.busy} onClick={nearby.locate}><LocateFixed size={17} aria-hidden="true" />{nearby.busy ? "Buscando…" : "Usar mi ubicación"}</button></div>
    <p role="status" className="r-demo-note">{nearby.message || "La ubicación es opcional: solo se solicita permiso al pulsar el botón. Puedes elegir manualmente."}</p>
    <div ref={mapBlock} className="r-locals-map"><DemoMap pointId={state.pointId} overview cityFilter={city} selectedId={viewedId} focusToken={focusToken} onSelectPoint={onMap} /></div>
    <div className="r-map-selection"><p role="status"><strong>En el mapa: {localLabel(point.id)}</strong><span>Referencia: {point.name}. Explorar no cambia el local de tu pedido.</span></p><Link to={`/restaurante/locales/${point.id}`} className="r-text-button">Ver ficha del local <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
    <div className="r-section-head r-locals-list-head"><h2>Todos los locales.</h2><p role="status">{visible.length} {visible.length === 1 ? "local simulado" : "locales simulados"}{city ? ` · ${city}` : ""}</p></div>
    <div className="r-locals-grid">{visible.map((item, index) => <LocationCard key={item.id} point={item} index={index} selected={state.pointId === item.id} viewed={viewedId === item.id} onOrder={onLocalOrder} onReserve={onLocalReserve} onMap={id => { onMap(id); mapBlock.current?.scrollIntoView({ block: "start", behavior: "instant" }) }} />)}</div>
  </section>
}

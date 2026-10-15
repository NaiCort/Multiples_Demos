import { Link, useParams } from "react-router-dom"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { findPoint, localLabel, pointTime } from "../data/locations"
import { useRestaurant } from "../state/context"
import DemoMap from "../components/DemoMap"
import LocalQR from "../components/LocalQR"

export default function LocalDetalle({ onLocalOrder, onLocalReserve, onSelectLocal }) {
  const { pointId } = useParams()
  const point = findPoint(pointId)
  const { state, now } = useRestaurant()
  if (!point) return <section className="r-page-section r-local-not-found"><p className="r-kicker">LOCALES</p><h1 tabIndex={-1}>Ese local no está<br />en esta demo.</h1><p className="r-section-intro">Puedes elegir cualquiera de los ocho locales simulados. Tu carrito y pedido se conservan.</p><Link className="r-button" to="/restaurante/locales">Explorar locales</Link></section>
  const selected = state.pointId === point.id
  const locked = state.order && state.order.status !== "completed"
  return <section className="r-local-detail r-page-section"><Link to="/restaurante/locales" className="r-text-button"><ArrowLeft size={16} aria-hidden="true" /> Todos los locales</Link>
    <div className="r-local-detail-head"><div><p className="r-kicker">PATIO 12 · LOCAL SIMULADO</p><h1 tabIndex={-1}>{point.cityLabel}.<br />{point.localName}.</h1><p className="r-section-intro">Una mesa imaginada alrededor de {point.name}. La misma cocina de barrio, otro escenario para probar la experiencia.</p><p className="r-demo-note">Referencia geográfica: {point.name}, {point.city}. No existe un restaurante de Patio 12 en este lugar.</p></div><div className="r-local-visit-card"><p className="r-kicker">EL PLAN DE HOY</p><h2>Nos vemos<br />en el patio.</h2><p>Mar–dom · 13:00–22:00<br />Lunes cerrado · horario ficticio</p><p className="r-demo-note">Hora en esta ciudad: {pointTime(point.id, now)} · {point.timeZone}. La prueba permanece disponible a cualquier hora.</p><div className="r-inline-actions"><button type="button" className="r-button" onClick={() => onLocalOrder(point.id)}>Pedir en este local</button><button type="button" className="r-secondary-button" onClick={() => onLocalReserve(point.id)}>Reservar aquí</button></div>
      {locked ? <p className="r-wait-notice">Tu pedido confirmado conserva {localLabel(state.order.pointId)}. Puedes explorar otros locales.</p> : selected ? <p className="r-demo-note"><strong>Este es tu local seleccionado.</strong></p> : <button type="button" className="r-text-button" onClick={() => onSelectLocal(point.id)}>Usar este local en mi visita</button>}
    </div></div>
    <div className="r-local-information"><div><h2>El local, de un vistazo.</h2><dl className="r-local-facts"><div><dt>Modalidades de ejemplo</dt><dd>Comer aquí, para llevar y a domicilio</dd></div><div><dt>Carta</dt><dd>Compartida por todos los locales de la demo</dd></div><div><dt>Comer aquí</dt><dd>25 mesas ficticias; espera de un minuto con salto de prueba</dd></div><div><dt>Entrega</dt><dd>Zonas y tiempos ilustrativos, sin reparto real</dd></div></dl><Link to="/restaurante/carta" className="r-text-button">Explorar la carta <ArrowUpRight size={16} aria-hidden="true" /></Link><LocalQR key={point.id} pointId={point.id} /></div>
      <div><h2>La referencia en el mapa.</h2><DemoMap key={point.id} pointId={point.id} /><a className="r-text-button" href={`https://www.openstreetmap.org/?mlat=${point.coordinates[1]}&mlon=${point.coordinates[0]}#map=16/${point.coordinates[1]}/${point.coordinates[0]}`} target="_blank" rel="noreferrer">Ver referencia en OpenStreetMap ↗</a></div>
    </div>
  </section>
}

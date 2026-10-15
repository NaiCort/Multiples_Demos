import { Link } from "react-router-dom"
import { ArrowUpRight, MapPin } from "lucide-react"
import { localLabel } from "../data/locations"

export default function LocationCard({ point, selected = false, viewed = false, onMap, onOrder, onReserve, index = 0 }) {
  return <article className={`r-local-card ${viewed ? "is-viewed" : ""}`} data-local={point.id}>
    <div className={`r-local-postcard r-local-color-${index % 4}`} aria-hidden="true"><span>patio 12 / {String(index + 1).padStart(2, "0")}</span><strong>{point.cityLabel}</strong><span>{point.localName} · local simulado</span><MapPin size={32} /></div>
    <div className="r-local-card-body"><div className="r-local-card-top"><h3><Link to={`/restaurante/locales/${point.id}`}>{localLabel(point.id)}</Link></h3>{selected && <span className="r-menu-tag">Tu local</span>}</div>
      <p>Referencia: {point.name}</p><p className="r-demo-note">Mar–dom · 13:00–22:00 · horario de muestra</p>
      <Link to={`/restaurante/locales/${point.id}`} className="r-text-button">Conocer este local <ArrowUpRight size={15} aria-hidden="true" /></Link>
      {onMap && <button type="button" className="r-text-button" aria-pressed={viewed} onClick={() => onMap(point.id)}>Mostrar en el mapa</button>}
      {(onOrder || onReserve) && <div className="r-local-actions"><button type="button" className="r-button" onClick={() => onOrder(point.id)}>Pedir aquí</button><button type="button" className="r-secondary-button" onClick={() => onReserve(point.id)}>Reservar</button></div>}
    </div>
  </article>
}

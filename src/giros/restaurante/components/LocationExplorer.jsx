import { useEffect, useRef, useState } from "react"
import { LocateFixed, MapPin, QrCode } from "lucide-react"
import Modal from "../../../components/shared/Modal"
import { entryLink, nearestPoint, POINTS, pointOrDefault, pointTime } from "../data/locations"
import { useRestaurant } from "../state/context"
import DemoMap from "./DemoMap"

export default function LocationExplorer({ onClose }) {
  const { state, dispatch, now } = useRestaurant()
  const [pointId, setPointId] = useState(state.pointId)
  const [geo, setGeo] = useState("")
  const [table, setTable] = useState("")
  const [qr, setQr] = useState(null)
  const [copy, setCopy] = useState("")
  const alive = useRef(true), geoBusy = useRef(false), request = useRef(0)
  const point = pointOrDefault(pointId)
  const locked = state.order && state.order.status !== "completed"
  const link = entryLink(point.id, table ? Number(table) : null)
  useEffect(() => { alive.current = true; return () => { alive.current = false } }, [])
  const locate = () => {
    if (geoBusy.current) return
    if (!navigator.geolocation) { setGeo("Este navegador no ofrece ubicación. Elige un punto de la lista."); return }
    geoBusy.current = true; setGeo("Buscando el punto más cercano…")
    navigator.geolocation.getCurrentPosition(position => {
      geoBusy.current = false
      if (!alive.current) return
      const result = nearestPoint([position.coords.longitude, position.coords.latitude])
      setPointId(result.point.id); setQr(null)
      setGeo(`Referencia más cercana: ${result.point.name}, a ${result.distance.toFixed(1)} km en línea recta. No es una sucursal ni confirma cobertura. Tu coordenada no se conserva.`)
    }, error => {
      geoBusy.current = false
      if (alive.current) setGeo(error.code === 1 ? "Ubicación no autorizada. Puedes elegir cualquiera de los puntos manualmente." : "No se pudo obtener tu ubicación a tiempo. Usa la lista de puntos.")
    }, { timeout: 8000, maximumAge: 60_000, enableHighAccuracy: false })
  }
  const makeQR = async () => {
    const ticket = ++request.current
    setQr(null); setCopy("Generando QR…")
    try {
      const QR = await import("qrcode")
      const data = await QR.toDataURL(link, { width: 280, margin: 4, errorCorrectionLevel: "M", color: { dark: "#203b2e", light: "#ffffff" } })
      if (alive.current && ticket === request.current) { setQr({ data, link }); setCopy("") }
    } catch { if (alive.current) setCopy("No se pudo crear el QR. El enlace sigue disponible para copiar.") }
  }
  const changePoint = id => { request.current++; setPointId(id); setQr(null); setCopy("") }
  return <Modal title="Puntos de demostración" onClose={onClose} className="restaurant-modal r-location-modal" radius={8}>
    <p className="r-location-intro">Ocho referencias, siete ciudades. Un mismo patio de ejemplo.</p>
    <p className="r-demo-note">Estos parques y plazas son reales. Patio 12 es ficticio y no tiene sucursales en ellos. No representan negocios, permisos de venta ni direcciones de entrega.</p>
    <div className="r-location-grid"><div>
      <button type="button" className="r-secondary-button r-full" onClick={locate}><LocateFixed size={17} aria-hidden="true" /> Usar mi ubicación</button>
      <p role="status" className="r-demo-note">{geo || "Opcional: solo se solicita permiso al pulsar este botón. También puedes usar la lista."}</p>
      <label className="r-field r-point-mobile">Punto para explorar<select aria-label="Punto para explorar" value={point.id} onChange={event => changePoint(event.target.value)}>{POINTS.map(item => <option key={item.id} value={item.id}>{item.name} · {item.city}</option>)}</select></label>
      <div className="r-point-list" role="group" aria-label="Explorar puntos">{POINTS.map((item, index) => <button type="button" key={item.id} aria-pressed={point.id === item.id} onClick={() => changePoint(item.id)}><span className="r-point-number">{String(index + 1).padStart(2, "0")}</span><span><strong>{item.name}</strong><small>{item.city}</small></span><MapPin size={16} aria-hidden="true" /></button>)}</div>
    </div><div className="r-point-detail" key={point.id}><p className="r-kicker">REFERENCIA GEOGRÁFICA · DEMO</p><h3>{point.name}</h3><p>{point.city}</p><p className="r-local-time">Hora del punto: {pointTime(point.id, now)} · {point.timeZone}</p>
      <DemoMap pointId={point.id} />
      <a className="r-text-button" href={`https://www.openstreetmap.org/?mlat=${point.coordinates[1]}&mlon=${point.coordinates[0]}#map=16/${point.coordinates[1]}/${point.coordinates[0]}`} target="_blank" rel="noreferrer">Ver referencia en OpenStreetMap ↗</a>
      {locked ? <p className="r-wait-notice">Puedes explorar otras ciudades. Tu pedido confirmado conserva {pointOrDefault(state.order.pointId).name}; no se modifica su recorrido.</p> : <button type="button" className="r-button r-full" disabled={point.id === state.pointId} onClick={() => { dispatch({ type: "point", pointId: point.id }); onClose() }}>{point.id === state.pointId ? "Punto actual de la visita" : "Usar este punto en mi visita"}</button>}
    </div></div>
    <details className="r-qr-section"><summary><QrCode size={18} aria-hidden="true" /> Enlace y QR de demostración</summary><p className="r-demo-note">Comparte el punto seleccionado o simula un QR de mesa ya ocupada. No contiene tu pedido, perfil ni datos personales. Abrirlo en otro dispositivo crea una visita independiente. Un enlace de localhost solo funciona en este dispositivo.</p>
      <label className="r-field">Tipo de acceso<select aria-label="Tipo de acceso" value={table} onChange={event => { request.current++; setTable(event.target.value); setQr(null); setCopy("") }}><option value="">Entrada normal al punto</option>{Array.from({ length: 25 }, (_, i) => <option key={i + 1} value={i + 1}>Mesa {i + 1} · ya estoy sentado</option>)}</select></label>
      <p className="r-share-link"><a href={link}>{link}</a></p><div className="r-inline-actions"><button type="button" className="r-secondary-button" onClick={async () => { try { await navigator.clipboard.writeText(link); setCopy("Enlace copiado.") } catch { setCopy("Selecciona y copia el enlace mostrado.") } }}>Copiar enlace</button><button type="button" className="r-button" onClick={makeQR}>Generar QR</button></div><p role="status" className="r-demo-note">{copy}</p>
      {qr?.link === link && <figure className="r-qr-result"><img src={qr.data} alt={`QR para ${point.name}${table ? `, mesa ${table}` : ", entrada normal"}`} width="280" height="280" /><figcaption>Patio 12 · {point.name}{table ? ` · Mesa ${table}` : " · Entrada normal"}</figcaption><a download={`patio12-${point.id}${table ? `-mesa-${table}` : ""}.png`} href={qr.data} className="r-text-button">Descargar QR</a></figure>}
    </details>
  </Modal>
}

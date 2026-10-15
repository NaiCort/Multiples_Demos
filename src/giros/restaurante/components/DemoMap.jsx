import { useEffect, useRef, useState } from "react"
import { MapPin } from "lucide-react"
import { exampleRoute, POINTS, pointOrDefault } from "../data/locations"

export default function DemoMap({ pointId, zone = null, progress = 0, overview = false, cityFilter = "", selectedId = null, focusToken = 0, onSelectPoint }) {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState(null)
  const container = useRef(null), engine = useRef(null), currentProgress = useRef(progress)
  const selectCallback = useRef(onSelectPoint), selectedRef = useRef(selectedId)
  useEffect(() => { selectCallback.current = onSelectPoint }, [onSelectPoint])
  useEffect(() => { selectedRef.current = selectedId; engine.current?.select(selectedId) }, [selectedId, focusToken])
  const point = pointOrDefault(pointId)
  const scene = `${point.id}-${zone?.id || ""}-${overview}-${cityFilter}-${attempt}`
  const status = !attempt ? "idle" : result?.scene === scene ? result.status : "loading"
  useEffect(() => {
    if (!attempt) return
    let disposed = false, failed = false, instance, timeout
    const setStatus = status => setResult({ scene, status })
    const fail = () => {
      if (disposed || failed) return
      failed = true
      setStatus("error"); clearTimeout(timeout)
      // Eliminar en otro turno evita interrumpir un evento interno de MapLibre.
      queueMicrotask(() => { if (!disposed && instance) { instance.destroy(); instance = null; engine.current = null } })
    }
    timeout = setTimeout(fail, 15_000)
    import("./mapEngine").then(({ createDemoMap }) => {
      if (disposed || failed) return
      instance = createDemoMap(container.current, { point, route: zone ? exampleRoute(point.id, zone) : null, outside: zone?.unavailable, points: overview ? POINTS.filter(item => !cityFilter || item.city === cityFilter) : null, onSelectPoint: id => selectCallback.current?.(id), onReady: () => { if (!disposed && !failed) { clearTimeout(timeout); setStatus("ready"); instance?.progress(currentProgress.current); instance?.select(selectedRef.current, false) } }, onError: fail })
      engine.current = instance
      instance.progress(currentProgress.current)
    }).catch(fail)
    return () => { disposed = true; clearTimeout(timeout); instance?.destroy(); engine.current = null }
  }, [point, zone, attempt, overview, cityFilter, scene])
  useEffect(() => { currentProgress.current = progress; engine.current?.progress(progress) }, [progress])
  const load = () => setAttempt(value => value + 1)
  return <div className={`r-map-block ${overview ? "r-overview-map" : ""}`}>
    <div className={`r-map-surface ${status === "ready" ? "is-ready" : ""}`}>
      <div ref={container} className="r-map-canvas" hidden={status === "idle" || status === "error"} />
      {status !== "ready" && <div className="r-map-placeholder"><MapPin size={30} aria-hidden="true" /><strong>{overview ? "Ocho locales simulados en México" : point.name}</strong><p>{status === "error" ? "No se pudo cargar el mapa. Puedes continuar con la lista, el pedido y sus tiempos." : status === "loading" ? "Cargando mapa… Puedes seguir usando el resto de la página." : overview ? "Encuentra cada referencia y abre la ficha de su local." : "Explora el punto y su cobertura ficticia."}</p>{status !== "loading" && <button type="button" className="r-secondary-button" onClick={load}>{status === "error" ? "Reintentar mapa" : "Mostrar mapa interactivo"}</button>}<span role="status" className="r-sr-only">{status === "error" ? "Mapa no disponible. La lista y el pedido siguen funcionando." : status === "loading" ? "Cargando mapa" : ""}</span></div>}
    </div>
    <p className="r-map-caption">{overview ? "Los círculos numerados agrupan locales cercanos: púlsalos para acercarte. El marcador 12 identifica un local simulado. Los parques son referencias; no hay restaurantes de Patio 12 en ellos." : <>{zone ? "A: referencia · B: destino ficticio · flecha: avance simulado." : "El marcador 12 es una referencia de demostración."} Cobertura de ejemplo: 5 km en línea recta. {zone && "El trazo es ilustrativo; no indica calles, tráfico ni GPS."}</>}</p>
    <p className="r-map-credit">Cartografía: <a href="https://openfreemap.org/" target="_blank" rel="noreferrer">OpenFreeMap</a> · <a href="https://www.openmaptiles.org/" target="_blank" rel="noreferrer">OpenMapTiles</a> · © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>. El mapa consulta servicios externos al abrirlo.</p>
  </div>
}

import { useEffect, useRef, useState } from "react"
import { nearestPoint } from "../data/locations"

export default function useNearbyLocal(onFound) {
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)
  const alive = useRef(true), running = useRef(false), callback = useRef(onFound)
  useEffect(() => { callback.current = onFound }, [onFound])
  useEffect(() => { alive.current = true; return () => { alive.current = false } }, [])
  const locate = () => {
    if (running.current) return
    if (!navigator.geolocation) { setMessage("Este navegador no ofrece ubicación. Elige una ciudad o un local de la lista."); return }
    running.current = true; setBusy(true); setMessage("Buscando la referencia más cercana…")
    navigator.geolocation.getCurrentPosition(position => {
      running.current = false
      if (!alive.current) return
      const found = nearestPoint([position.coords.longitude, position.coords.latitude])
      setBusy(false); setMessage(`${found.point.name}: a ${found.distance.toFixed(1)} km en línea recta. Es una referencia de demostración; no confirma cobertura. Tu coordenada no se conserva.`)
      callback.current?.(found.point.id)
    }, error => {
      running.current = false
      if (alive.current) { setBusy(false); setMessage(error.code === 1 ? "Ubicación no autorizada. Puedes elegir un local manualmente." : "No se pudo obtener tu ubicación a tiempo. Usa la lista de locales.") }
    }, { timeout: 8000, maximumAge: 60_000, enableHighAccuracy: false })
  }
  return { message, busy, locate }
}

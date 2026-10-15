import { useEffect, useRef, useState } from "react"
import { QrCode } from "lucide-react"
import { entryLink, localLabel } from "../data/locations"

export default function LocalQR({ pointId }) {
  const [table, setTable] = useState("")
  const [qr, setQr] = useState(null)
  const [message, setMessage] = useState("")
  const alive = useRef(true), request = useRef(0)
  const link = entryLink(pointId, table ? Number(table) : null)
  useEffect(() => { alive.current = true; return () => { alive.current = false } }, [])
  const makeQR = async () => {
    const ticket = ++request.current
    setQr(null); setMessage("Generando QR…")
    try {
      const QR = await import("qrcode")
      const data = await QR.toDataURL(link, { width: 280, margin: 4, errorCorrectionLevel: "M", color: { dark: "#203b2e", light: "#ffffff" } })
      if (alive.current && ticket === request.current) { setQr({ data, link }); setMessage("") }
    } catch { if (alive.current) setMessage("No se pudo crear el QR. El enlace sigue disponible para copiar.") }
  }
  return <details className="r-qr-section"><summary><QrCode size={18} aria-hidden="true" /> Enlace y QR de este local</summary>
    <p className="r-demo-note">Comparte este local simulado o prueba el QR de una mesa ya ocupada. No incluye pedidos ni datos personales; cada dispositivo tiene una sesión independiente. Un enlace de localhost solo funciona allí.</p>
    <label className="r-field">Tipo de acceso<select aria-label="Tipo de acceso" value={table} onChange={event => { request.current++; setTable(event.target.value); setQr(null); setMessage("") }}><option value="">Entrada normal al local</option>{Array.from({ length: 25 }, (_, i) => <option key={i + 1} value={i + 1}>Mesa {i + 1} · ya estoy sentado</option>)}</select></label>
    <p className="r-share-link"><a href={link}>{link}</a></p><div className="r-inline-actions"><button type="button" className="r-secondary-button" onClick={async () => { try { await navigator.clipboard.writeText(link); setMessage("Enlace copiado.") } catch { setMessage("Selecciona y copia el enlace mostrado.") } }}>Copiar enlace</button><button type="button" className="r-button" onClick={makeQR}>Generar QR</button></div><p role="status" className="r-demo-note">{message}</p>
    {qr?.link === link && <figure className="r-qr-result"><img src={qr.data} alt={`QR para ${localLabel(pointId)}${table ? `, mesa ${table}` : ", entrada normal"}`} width="280" height="280" /><figcaption>Patio 12 · {localLabel(pointId)}{table ? ` · Mesa ${table}` : " · Entrada normal"}</figcaption><a download={`patio12-${pointId}${table ? `-mesa-${table}` : ""}.png`} href={qr.data} className="r-text-button">Descargar QR</a></figure>}
  </details>
}

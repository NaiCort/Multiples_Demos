import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useLocation, useNavigate } from "react-router-dom"
import { ArrowUpRight, Grip, Maximize2, Minimize2, Move, PictureInPicture2, X } from "lucide-react"
import { useRestaurant } from "../state/context"
import { formatClock, remainingSeconds } from "../state/model"
import "./timer.css"
function viewport() {
  const v = window.visualViewport
  const style = getComputedStyle(document.documentElement)
  const safe = side => parseFloat(style.getPropertyValue(`--r-timer-safe-${side}`)) || 0
  return { width: Math.min(v?.width || window.innerWidth, document.documentElement.clientWidth || window.innerWidth) - safe("left") - safe("right"), height: (v?.height || window.innerHeight) - safe("top") - safe("bottom"), left: (v?.offsetLeft || 0) + safe("left"), top: (v?.offsetTop || 0) + safe("top") }
}
const labels = { preparing: "En preparación", delivering: "En camino", ready: "Pedido listo", delivered: "Entrega lista" }
export default function FloatingTimer() {
  const { state, dispatch, now } = useRestaurant()
  const location = useLocation(), navigate = useNavigate()
  const [view, setView] = useState(viewport)
  const [size, setSize] = useState({ width: 190, height: 170 })
  const [dragPosition, setDragPosition] = useState(null)
  const [positionsOpen, setPositionsOpen] = useState(false)
  const [pip, setPip] = useState(null)
  const [pipError, setPipError] = useState("")
  const pipRef = useRef(null), card = useRef(null), drag = useRef(null)
  const { visit, order, widget } = state
  const waiting = visit?.stage === "waiting"
  const active = !!visit && (visit.mode === "dine" || !!order) && order?.status !== "completed"
  const compact = widget.compact || location.pathname !== "/restaurante"
  const deadline = waiting ? visit.deadline : order?.deadline
  const seconds = remainingSeconds(deadline, now)
  const label = waiting ? "Espera de mesa" : order ? labels[order.status] : visit?.mode === "dine" ? `Mesa ${visit.table} lista` : "Tu visita al patio"
  const reference = order?.id || visit?.id
  const bottomReserve = location.pathname === "/psicologo" ? 130 : 58
  const top = view.top + Math.min(148, view.height * 0.28), left = view.left + 12
  const rangeX = Math.max(0, view.width - Math.min(size.width, view.width - 24) - 24)
  const rangeY = Math.max(0, view.height - (top - view.top) - size.height - bottomReserve)
  const xy = dragPosition || { x: widget.x, y: widget.y }
  const open = () => {
    pipRef.current?.close()
    window.focus()
    navigate(`/restaurante?seguimiento=${encodeURIComponent(reference)}`)
  }
  useEffect(() => {
    const update = () => setView(viewport())
    window.addEventListener("resize", update)
    window.visualViewport?.addEventListener("resize", update)
    window.visualViewport?.addEventListener("scroll", update)
    return () => { window.removeEventListener("resize", update); window.visualViewport?.removeEventListener("resize", update); window.visualViewport?.removeEventListener("scroll", update) }
  }, [])
  useEffect(() => {
    if (!active || !card.current) return
    const observer = new ResizeObserver(entries => { const rect = entries[0].target.getBoundingClientRect(); setSize({ width: rect.width, height: rect.height }) })
    observer.observe(card.current)
    return () => observer.disconnect()
  }, [active, compact])
  useEffect(() => { if (!active) pipRef.current?.close() }, [active])
  useEffect(() => () => pipRef.current?.close(), [])
  const openPip = async () => {
    setPipError("")
    try {
      const win = await window.documentPictureInPicture.requestWindow({ width: 280, height: 230 })
      if (!card.current) { win.close(); return }
      const style = win.document.createElement("style")
      style.textContent = "body{margin:0;padding:20px;background:#f6f5ee;color:#203b2e;font:15px/1.5 system-ui,sans-serif}h1{font-size:17px;margin:0 0 6px}p{margin:8px 0}strong{font-size:32px;font-variant-numeric:tabular-nums}button{width:100%;min-height:44px;border:0;border-radius:4px;background:#203b2e;color:white;cursor:pointer;font:inherit}small{font-size:12px}button:focus-visible{outline:3px solid #1260bc;outline-offset:3px}"
      win.document.head.append(style)
      win.document.title = "Patio 12 · Seguimiento de ejemplo"
      pipRef.current = win
      win.addEventListener("pagehide", () => { pipRef.current = null; setPip(null) }, { once: true })
      setPip(win)
    } catch { setPipError("No se pudo abrir. El seguimiento sigue disponible aquí.") }
  }
  if (!active) return null
  const startDrag = event => {
    if (event.button !== 0 && event.pointerType !== "touch") return
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = { clientX: event.clientX, clientY: event.clientY, x: widget.x, y: widget.y, moved: false }
  }
  const moveDrag = event => {
    if (!drag.current) return
    const dx = event.clientX - drag.current.clientX, dy = event.clientY - drag.current.clientY
    if (Math.abs(dx) + Math.abs(dy) > 5) drag.current.moved = true
    const position = { x: rangeX ? Math.max(0, Math.min(1, drag.current.x + dx / rangeX)) : 0, y: rangeY ? Math.max(0, Math.min(1, drag.current.y + dy / rangeY)) : 0 }
    drag.current.position = position
    setDragPosition(position)
  }
  const endDrag = () => { if (drag.current?.position) dispatch({ type: "widget", value: drag.current.position }); setDragPosition(null) }
  return <>
    <aside ref={card} className={`r-timer ${compact ? "r-timer-compact" : ""}`} aria-label="Seguimiento flotante de Patio 12" style={{ left: left + xy.x * rangeX, top: top + xy.y * rangeY, maxWidth: view.width - 24, maxHeight: Math.max(80, view.height - (top - view.top) - bottomReserve) }}>
      <div className="r-timer-head"><button type="button" className="r-timer-grip" aria-label="Mover contador; tocar para elegir esquina" onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onClick={() => { if (!drag.current?.moved) setPositionsOpen(value => !value); drag.current = null }}><Grip size={17} aria-hidden="true" /></button><button type="button" className="r-timer-open" onClick={open}><span>{label}</span>{compact && <strong>{deadline ? formatClock(seconds) : visit.mode === "dine" && !order ? `#${visit.table}` : "Ver"}</strong>}</button><button type="button" className="r-timer-icon" aria-label={compact ? location.pathname !== "/restaurante" ? "Volver a mi visita" : "Ampliar contador" : "Minimizar contador"} onClick={() => { if (compact && location.pathname !== "/restaurante") open(); dispatch({ type: "widget", value: { compact: !compact } }) }}>{compact ? <Maximize2 size={16} aria-hidden="true" /> : <Minimize2 size={16} aria-hidden="true" />}</button></div>
      {!compact && <><button type="button" className="r-timer-main" onClick={open}><strong>{deadline ? formatClock(seconds) : visit.mode === "dine" && !order ? `Mesa ${visit.table}` : "Ver pedido"}</strong><span>{order ? `Turno ${order.turn} · demo` : "Patio 12 · demo"} <ArrowUpRight size={12} aria-hidden="true" /></span></button><div className="r-timer-actions">{waiting && <button type="button" className="r-timer-skip" onClick={() => dispatch({ type: "skip-wait" })} aria-label="Saltar espera desde el contador">Saltar · demo</button>}<button type="button" aria-label="Elegir esquina del contador" onClick={() => setPositionsOpen(value => !value)}><Move size={16} aria-hidden="true" /></button>{"documentPictureInPicture" in window && <button type="button" aria-label="Abrir contador en ventana flotante" onClick={openPip}><PictureInPicture2 size={16} aria-hidden="true" /></button>}</div></>}
      {positionsOpen && <div className="r-timer-positions"><p>Colocar en una esquina</p>{[[0, 0, "Superior izquierda"], [1, 0, "Superior derecha"], [0, 1, "Inferior izquierda"], [1, 1, "Inferior derecha"]].map(([x, y, text]) => <button type="button" key={text} onClick={() => { dispatch({ type: "widget", value: { x, y } }); setPositionsOpen(false) }}>{text}</button>)}</div>}
      {pipError && <p className="r-timer-error" role="status">{pipError}</p>}
      {pip && <p className="r-timer-pip-note">Ventana flotante abierta. Cerrar la pestaña también la cierra.<button type="button" aria-label="Cerrar ventana flotante" onClick={() => pip.close()}><X size={14} aria-hidden="true" /></button></p>}
    </aside>
    {pip && createPortal(<div><h1>{label}</h1><p><strong>{deadline ? formatClock(seconds) : visit.mode === "dine" && !order ? `Mesa ${visit.table}` : "Pedido listo"}</strong></p><p><small>Patio 12 · demostración</small></p><button type="button" onClick={open}>Volver a mi visita</button><p><small>La ventana termina al cerrar la pestaña.</small></p></div>, pip.document.body)}
  </>
}

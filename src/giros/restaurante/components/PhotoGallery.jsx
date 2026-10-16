import { useEffect, useId, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
export default function PhotoGallery({ product, compact = false }) {
  const [selection, setSelection] = useState({ index: 0, direction: 1, change: 0 })
  const start = useRef(null)
  const frame = useRef(null)
  const id = useId()
  const count = product.photos.length
  const index = selection.index % count
  const move = direction => setSelection(value => ({ index: (value.index + direction + count) % count, direction, change: value.change + 1 }))
  const select = next => setSelection(value => next === value.index ? value : { index: next, direction: next > value.index ? 1 : -1, change: value.change + 1 })
  const current = product.photos[index]
  useEffect(() => {
    if (product.photos.length < 2) return
    // Preparar la otra toma cerca de la vista evita una descarga al deslizar.
    const preload = () => product.photos.slice(1).forEach(photo => { const image = new Image(); image.src = photo.src })
    if (typeof IntersectionObserver === "undefined") { preload(); return }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { preload(); observer.disconnect() }
    }, { rootMargin: "200px" })
    observer.observe(frame.current)
    return () => observer.disconnect()
  }, [product.photos])
  return <div className={`r-gallery ${compact ? "r-gallery-small" : ""}`} role="group" aria-label={`Fotografías de ${product.name}`}>
    <div ref={frame} id={id} className="r-gallery-frame" onPointerDown={event => { if (event.pointerType === "touch" && !event.target.closest("button")) { start.current = { x: event.clientX, y: event.clientY }; event.currentTarget.setPointerCapture(event.pointerId) } }} onPointerUp={event => {
      if (!start.current) return
      const dx = event.clientX - start.current.x, dy = event.clientY - start.current.y
      if (count > 1 && Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1)
      start.current = null
    }} onPointerCancel={() => { start.current = null }}>
      <img key={`${product.id}-${selection.change}`} className={selection.change ? `r-gallery-image ${selection.direction > 0 ? "r-gallery-next" : "r-gallery-previous"}` : "r-gallery-image"} src={current.src} alt={`${product.name}: ${current.label.toLowerCase()}`} width="800" height="600" loading={selection.change ? "eager" : "lazy"} draggable="false" />
      {count > 1 && <span className="r-photo-count" aria-hidden="true">{index + 1} / {count}</span>}
      {count > 1 && <div className="r-gallery-arrows"><button type="button" aria-label={`Foto anterior de ${product.name}`} aria-controls={id} onClick={() => move(-1)}><ChevronLeft size={17} aria-hidden="true" /></button><button type="button" aria-label={`Foto siguiente de ${product.name}`} aria-controls={id} onClick={() => move(1)}><ChevronRight size={17} aria-hidden="true" /></button></div>}
    </div>
    {count > 1 && <div className="r-gallery-dots" aria-label="Elegir fotografía">{product.photos.map((photo, i) => <button type="button" key={photo.src} aria-label={`Foto ${i + 1} de ${product.name}`} aria-pressed={i === index} aria-controls={id} onClick={() => select(i)}><span aria-hidden="true" /></button>)}<span className="r-sr-only" aria-live="polite" aria-atomic="true">Foto {index + 1} de {count}: {current.label}</span></div>}
  </div>
}

import { useId, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
export default function PhotoGallery({ product, compact = false }) {
  const [index, setIndex] = useState(0)
  const start = useRef(null)
  const id = useId()
  const count = product.photos.length
  const move = direction => setIndex(value => (value + direction + count) % count)
  const current = product.photos[index]
  return <div className={`r-gallery ${compact ? "r-gallery-small" : ""}`} role="group" aria-label={`Fotografías de ${product.name}`}>
    <div className="r-gallery-frame" onPointerDown={event => { if (event.pointerType === "touch") { start.current = { x: event.clientX, y: event.clientY }; event.currentTarget.setPointerCapture(event.pointerId) } }} onPointerUp={event => {
      if (!start.current) return
      const dx = event.clientX - start.current.x, dy = event.clientY - start.current.y
      if (count > 1 && Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1)
      start.current = null
    }} onPointerCancel={() => { start.current = null }}>
      <img id={id} src={current.src} alt={`${product.name}: ${current.label.toLowerCase()}`} width="800" height="600" loading="lazy" />
      {count > 1 && <span className="r-photo-count" aria-hidden="true">{index + 1} / {count}</span>}
      {count > 1 && <div className="r-gallery-arrows"><button type="button" aria-label={`Foto anterior de ${product.name}`} aria-controls={id} onClick={() => move(-1)}><ChevronLeft size={17} aria-hidden="true" /></button><button type="button" aria-label={`Foto siguiente de ${product.name}`} aria-controls={id} onClick={() => move(1)}><ChevronRight size={17} aria-hidden="true" /></button></div>}
    </div>
    {count > 1 && <div className="r-gallery-dots" aria-label="Elegir fotografía">{product.photos.map((photo, i) => <button type="button" key={photo.src} aria-label={`Foto ${i + 1} de ${product.name}`} aria-pressed={i === index} onClick={() => setIndex(i)}><span aria-hidden="true" /></button>)}<span className="r-sr-only" aria-live="polite">Foto {index + 1} de {count}</span></div>}
  </div>
}

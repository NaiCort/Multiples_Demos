import { useState } from "react"
import { Pause, Play } from "lucide-react"

// Cinta con lo que pasa hoy en la barra. Se mueve solo si el visitante no pidió menos
// movimiento, y siempre puede detenerse (contenido en movimiento por más de 5 s).
export default function Marquee({ items }) {
  const [paused, setPaused] = useState(false)
  const row = items.map((item) => <span key={item}>{item}</span>)
  return (
    <section className={`l-marquee${paused ? " is-paused" : ""}`} aria-label="Hoy en Ladera">
      <div className="l-marquee-track">
        <div className="l-marquee-row">{row}</div>
        <div className="l-marquee-row" aria-hidden="true">
          {row}
        </div>
      </div>
      <button
        type="button"
        className="l-marquee-toggle"
        aria-label={paused ? "Reanudar la cinta" : "Detener la cinta"}
        aria-pressed={paused}
        onClick={() => setPaused((value) => !value)}
      >
        {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
      </button>
    </section>
  )
}
